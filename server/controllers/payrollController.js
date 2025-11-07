const { Payroll, Employee } = require("../models");

const notificationController = require("./notificationController");

exports.generateAllPayrolls = async (req, res) => {
  try {
    const { month } = req.body;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const employees = await Employee.findAll();

    if (employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No employees found to generate payroll" });
    }

    const newPayrolls = [];
    for (const employee of employees) {
      const base_salary = 5000000;
      const bonus = 500000;
      const deductions = 250000;
      const total_salary = base_salary + bonus - deductions;

      const payroll = await Payroll.create({
        employee_id: employee.id,
        month,
        base_salary,
        bonus,
        deductions,
        total_salary,
        status: "pending",
        payment_date: null,
      });
      newPayrolls.push(payroll);
    }

    return res.status(200).json({
      message: `${newPayrolls.length} payroll records generated successfully`,
      payrolls: newPayrolls,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.approvePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_date } = req.body;

    const payroll = await Payroll.findByPk(id, {
      include: [{ model: Employee, attributes: ["name", "email", "position"] }],
    });

    if (!payroll) {
      return res.status(404).json({ message: "Payroll record not found" });
    }

    if (payroll.status === "paid") {
      return res
        .status(400)
        .json({ message: "Payroll has already been processed" });
    }

    payroll.status = "paid";
    payroll.payment_date = payment_date || new Date();
    await payroll.save();

    await exports.sendPayrollNotification(payroll);

    return res
      .status(200)
      .json({ message: "Payroll processed successfully", payroll });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.sendPayrollNotification = async (payroll) => {
  try {
    const employee = await Employee.findByPk(payroll.employee_id);
    if (!employee) return;

    await notificationController.sendNotification(
      {
        body: {
          employee_id: employee.id,
          title: "Salary Payment Processed",
          message: `Your salary for ${payroll.month} has been processed. Total received: $${payroll.total_salary}`,
          type: "payroll",
        },
      },
      { status: () => ({ json: () => {} }) }
    );
  } catch (error) {
    console.error("Error sending payroll notification:", error);
  }
};

exports.createPayroll = async (req, res) => {
  try {
    const {
      employee_id,
      month,
      base_salary,
      bonus,
      deductions,
      total_salary,
      status,
      payment_date,
    } = req.body;

    const employee = await Employee.findByPk(employee_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const payroll = await Payroll.create({
      employee_id,
      month,
      base_salary,
      bonus,
      deductions,
      total_salary,
      status,
      payment_date,
    });

    return res.status(201).json({ message: "Payroll created", payroll });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updatePayrollStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_date } = req.body;

    const payroll = await Payroll.findByPk(id);
    if (!payroll) {
      return res.status(404).json({ message: "Payroll record not found" });
    }

    payroll.status = status;
    payroll.payment_date = payment_date || payroll.payment_date;

    await payroll.save();

    return res.status(200).json({ message: "Payroll updated", payroll });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getPayrollByEmployee = async (req, res) => {
  try {
    const { employee_id } = req.params;

    const payrolls = await Payroll.findAll({
      where: { employee_id },
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["name", "email", "position"],
        },
      ],
    });

    if (payrolls.length === 0) {
      return res
        .status(404)
        .json({ message: "No payroll records found for this employee" });
    }

    return res.status(200).json({ payrolls });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getPayrollByMonth = async (req, res) => {
  try {
    const { month } = req.params;

    const payrolls = await Payroll.findAll({
      where: { month },
      include: [
        {
          model: Employee,
          attributes: ["name", "email", "position"],
        },
      ],
    });

    if (payrolls.length === 0) {
      return res
        .status(404)
        .json({ message: "No payroll records found for this month" });
    }

    return res.status(200).json({ payrolls });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getPayrollById = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.findByPk(id, {
      include: [{ model: Employee, attributes: ["name", "email", "position"] }],
    });

    if (!payroll) {
      return res.status(404).json({ message: "Payroll record not found" });
    }

    return res.status(200).json({ payroll });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllPayroll = async (req, res) => {
  try {
    const payrolls = await Payroll.findAll({
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "name", "email", "position"],
        },
      ],
    });

    return res.status(200).json({ data: payrolls });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deletePayroll = async (req, res) => {
  try {
    const { id } = req.params;

    const payroll = await Payroll.findByPk(id);
    if (!payroll) {
      return res.status(404).json({ message: "Payroll record not found" });
    }

    await payroll.destroy();

    return res.status(200).json({ message: "Payroll deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
