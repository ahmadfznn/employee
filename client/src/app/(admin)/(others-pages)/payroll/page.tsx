"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { Modal } from "@/components/ui/modal";
import { DownloadIcon, EyeIcon } from "@/icons";
import { HiArrowDownOnSquare } from "react-icons/hi2";
import { exportToExcel } from "@/services/FileService";
import { PayrollService } from "@/services/PayrollService";
import { Payroll } from "@/types/payroll";
import { useRouter } from "next/navigation";
// @ts-ignore
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

const TABS = [
  { key: "payroll", label: "Payroll Table" },
  { key: "history", label: "Salary History" },
  { key: "tax", label: "Tax & BPJS Report" },
  { key: "bonus", label: "Bonus & Incentives" },
];

const mockPayrolls = [
  {
    id: 1,
    employee: { name: "John Doe" },
    base_salary: 5000000,
    allowances: 1000000,
    deductions: 500000,
    net_pay: 5500000,
    status: "paid",
    month: "2024-06",
    payment_date: "2024-06-28",
  },
  {
    id: 2,
    employee: { name: "Jane Smith" },
    base_salary: 6000000,
    allowances: 1200000,
    deductions: 400000,
    net_pay: 6800000,
    status: "unpaid",
    month: "2024-06",
    payment_date: "-",
  },
];

export default function PayrollPage() {
  const [data, setData] = useState<any[]>([]);
  const [loadingData, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState({ show: false, title: "", text: "", success: true });
  const [activeTab, setActiveTab] = useState("payroll");
  const [slipModal, setSlipModal] = useState<{ open: boolean; payroll: any | null }>({ open: false, payroll: null });
  const [generating, setGenerating] = useState(false);
  const [transferring, setTransferring] = useState<{ id: number | null; status: string }>({ id: null, status: "" });
  const router = useRouter();

  useEffect(() => {
    // Simulate fetch
    setLoading(true);
    setTimeout(() => {
      setData(mockPayrolls);
      setLoading(false);
    }, 800);
  }, []);

  // PDF export for slip
  const exportSlipPDF = (payroll: any) => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Field", "Value"]],
      body: [
        ["Employee Name", payroll.employee.name],
        ["Base Salary", payroll.base_salary],
        ["Allowances", payroll.allowances],
        ["Deductions", payroll.deductions],
        ["Net Pay", payroll.net_pay],
        ["Status", payroll.status],
        ["Month", payroll.month],
        ["Payment Date", payroll.payment_date],
      ],
    });
    doc.save(`Payroll_Slip_${payroll.employee.name}.pdf`);
  };

  // Auto Payroll Generator
  const handleGeneratePayroll = () => {
    setGenerating(true);
    setTimeout(() => {
      setAlert({ show: true, title: "Success", text: "Payroll generated based on attendance and allowances!", success: true });
      setGenerating(false);
    }, 1200);
  };

  // Payroll Transfer Simulation
  const handleTransfer = (id: number) => {
    setTransferring({ id, status: "pending" });
    setTimeout(() => {
      setTransferring({ id, status: "success" });
      setAlert({ show: true, title: "Success", text: "Payroll transferred successfully!", success: true });
    }, 1500);
  };

  // Payroll Table Columns
  const columns = [
    { key: "employee", label: "Employee Name" },
    { key: "base_salary", label: "Basic Salary" },
    { key: "allowances", label: "Allowances" },
    { key: "deductions", label: "Deductions" },
    { key: "net_pay", label: "Net Pay" },
    { key: "status", label: "Payment Status" },
    { key: "actions", label: "Actions" },
  ];

  // Render Payroll Table Rows
  const renderRows = (rows: any[]) =>
    rows.map((row) => (
      <tr key={row.id} className="border-b dark:border-gray-700">
        <td className="py-2 px-3">{row.employee.name}</td>
        <td className="py-2 px-3">Rp {row.base_salary.toLocaleString()}</td>
        <td className="py-2 px-3">Rp {row.allowances.toLocaleString()}</td>
        <td className="py-2 px-3">Rp {row.deductions.toLocaleString()}</td>
        <td className="py-2 px-3 font-bold">Rp {row.net_pay.toLocaleString()}</td>
        <td className="py-2 px-3">
          <span className={`px-2 py-1 rounded text-xs font-semibold 
            ${row.status === "paid" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"}
          `}>
            {row.status === "paid" ? "Paid" : "Unpaid"}
          </span>
        </td>
        <td className="py-2 px-3 flex gap-2">
          <Button size="sm" variant="outline" startIcon={<EyeIcon />} onClick={() => setSlipModal({ open: true, payroll: row })}>
            Slip
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleTransfer(row.id)} disabled={transferring.id === row.id && transferring.status === "pending"}>
            {transferring.id === row.id && transferring.status === "pending" ? "Transferring..." : "Transfer"}
          </Button>
        </td>
      </tr>
    ));

  // Tab Content
  const renderTabContent = () => {
    switch (activeTab) {
      case "payroll":
        return (
          <ComponentCard
            suffix={
              <div className="flex gap-2">
                <Button variant="outline" startIcon={<HiArrowDownOnSquare />} onClick={handleGeneratePayroll} disabled={generating}>
                  {generating ? "Generating..." : "Auto Payroll Generator"}
                </Button>
                <Button variant="outline" startIcon={<DownloadIcon />} onClick={() => exportToExcel(data, "Payroll_Data")}>Export Excel</Button>
              </div>
            }
          >
            <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-700 mt-4">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key} className="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                  {loadingData ? (
                    <tr><td colSpan={columns.length} className="text-center py-8 text-gray-400">Loading...</td></tr>
                  ) : data.length === 0 ? (
                    <tr><td colSpan={columns.length} className="text-center py-8 text-gray-400">No payroll data found.</td></tr>
                  ) : (
                    renderRows(data)
                  )}
                </tbody>
              </table>
            </div>
          </ComponentCard>
        );
      case "history":
        return (
          <ComponentCard>
            <div className="text-gray-600 dark:text-gray-300">Salary History (mock data):
              <ul className="mt-2 list-disc ml-6">
                <li>John Doe: May 2024 - Rp 5,500,000 (Paid)</li>
                <li>Jane Smith: May 2024 - Rp 6,800,000 (Paid)</li>
              </ul>
            </div>
          </ComponentCard>
        );
      case "tax":
        return (
          <ComponentCard>
            <div className="text-gray-600 dark:text-gray-300">Tax & BPJS Report (mock):
              <ul className="mt-2 list-disc ml-6">
                <li>John Doe: Tax Rp 250,000, BPJS Rp 150,000</li>
                <li>Jane Smith: Tax Rp 300,000, BPJS Rp 180,000</li>
              </ul>
            </div>
          </ComponentCard>
        );
      case "bonus":
        return (
          <ComponentCard>
            <div className="text-gray-600 dark:text-gray-300">Bonus & Incentives (mock):
              <ul className="mt-2 list-disc ml-6">
                <li>John Doe: Q1 Bonus - Rp 1,000,000</li>
                <li>Jane Smith: Yearly Bonus - Rp 2,000,000</li>
              </ul>
            </div>
          </ComponentCard>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {alert.show && (
        <Alert title={alert.title} message={alert.text} variant={alert.success ? "success" : "error"} />
      )}
      <PageBreadcrumb pageTitle="Payroll" />
      <div className="flex gap-2 mb-4 mt-2">
        {TABS.map((tab) => (
          <Button key={tab.key} variant={activeTab === tab.key ? "primary" : "outline"} onClick={() => setActiveTab(tab.key)} className="capitalize">
            {tab.label}
          </Button>
        ))}
      </div>
      {renderTabContent()}
      {/* Payroll Slip Modal */}
      <Modal isOpen={slipModal.open} onClose={() => setSlipModal({ open: false, payroll: null })}>
        <div className="space-y-4">
          <div className="text-lg font-semibold">Payroll Slip</div>
          {slipModal.payroll && (
            <div className="space-y-1">
              <div><b>Employee:</b> {slipModal.payroll.employee.name}</div>
              <div><b>Base Salary:</b> Rp {slipModal.payroll.base_salary.toLocaleString()}</div>
              <div><b>Allowances:</b> Rp {slipModal.payroll.allowances.toLocaleString()}</div>
              <div><b>Deductions:</b> Rp {slipModal.payroll.deductions.toLocaleString()}</div>
              <div><b>Net Pay:</b> Rp {slipModal.payroll.net_pay.toLocaleString()}</div>
              <div><b>Status:</b> {slipModal.payroll.status === "paid" ? "Paid" : "Unpaid"}</div>
              <div><b>Month:</b> {slipModal.payroll.month}</div>
              <div><b>Payment Date:</b> {slipModal.payroll.payment_date}</div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSlipModal({ open: false, payroll: null })}>Close</Button>
            <Button variant="outline" startIcon={<DownloadIcon />} onClick={() => slipModal.payroll && exportSlipPDF(slipModal.payroll)}>Download PDF</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
