import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  const excelFile = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(excelFile, `${fileName}.xlsx`);
};

export const exportToPDF = (data: any[], fileName: string) => {
  const doc = new jsPDF();

  doc.text("Employee Data", 14, 10);

  const headers = [["ID", "Name", "Email", "Position"]];
  const tableData = data.map((employee) => [
    employee.id,
    employee.name,
    employee.email,
    employee.position,
  ]);

  (doc as any).autoTable({
    head: headers,
    body: tableData,
    startY: 20,
  });

  doc.save(`${fileName}.pdf`);
};
