"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { EmployeeService } from "@/services/EmployeeService";
import { Employee } from "@/types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function PieChartOne() {
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    EmployeeService.getAllEmployees().then((res) => {
      const count = countRoles(res.data.data);
      setData(count);
    });
  }, []);

  const countRoles = (data: Employee[]) => {
    let employeeCount = 0;
    let adminCount = 0;
    let managerCount = 0;

    data &&
      data.forEach((person) => {
        if (person.role === "employee") employeeCount++;
        else if (person.role === "admin") adminCount++;
        else if (person.role === "manager") managerCount++;
      });

    return [employeeCount, adminCount, managerCount];
  };

  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Employee", "Admin", "Manager"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50",
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="flex justify-center">
      <ReactApexChart
        options={options}
        series={data}
        type="donut"
        height={300}
      />
    </div>
  );
}
