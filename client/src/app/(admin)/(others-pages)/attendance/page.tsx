"use client";

import React, { useEffect, useState, useRef } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { Modal } from "@/components/ui/modal";
import { HiArrowDownOnSquare } from "react-icons/hi2";
import { DownloadIcon, EyeIcon } from "@/icons";
import { exportToExcel } from "@/services/FileService";
import { AttendanceService } from "@/services/AttendanceService";
import { Attendance } from "@/types/attendance";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
// @ts-ignore
import autoTable from "jspdf-autotable";

const exportToPDF = (data: any[], filename: string) => {
  try {
    if (!data.length) return;
    const doc = new jsPDF();
    const columns = Object.keys(data[0]);
    const rows = data.map((row) => columns.map((col) => row[col] ?? "-"));
    autoTable(doc, { head: [columns], body: rows });
    doc.save(`${filename}.pdf`);
  } catch (e) {
    alert("PDF export failed.");
  }
};

const TABS = [
  { key: "attendance", label: "Attendance Table" },
  { key: "monthly", label: "Monthly Summary" },
  { key: "late", label: "Late Employee Report" },
  { key: "overtime", label: "Overtime Report" },
];

type NormalizedEmployee = {
  name: string;
  department: string;
  [key: string]: any;
};

function normalizeAttendance(row: any): Attendance {
  return {
    ...row,
    id: row.id ?? Math.random().toString(36).slice(2),
    employee: {
      ...(row.employee || {}),
      name: row.employee?.name || "-",
      department: row.employee?.department || "-",
    } as NormalizedEmployee,
    check_in: row.check_in || "-",
    check_out: row.check_out || "-",
    status: row.status || "-",
    date: row.date || "-",
  };
}

export default function AttendancePage() {
  const [data, setData] = useState<Attendance[]>([]);
  const [filteredData, setFilteredData] = useState<Attendance[]>([]);
  const [loadingData, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState({ show: false, title: "", text: "", success: true });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("attendance");
  const [filters, setFilters] = useState({ dateStart: "", dateEnd: "", department: "", employee: "" });
  const [departments, setDepartments] = useState<string[]>([]);
  const [process, setProcess] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    getData();
    getDepartments();
    return () => { isMounted.current = false; };
  }, [process]);

  useEffect(() => {
    setPage(1);
    let filtered = [...data];
    if (filters.dateStart && filters.dateEnd) {
      filtered = filtered.filter((d) => {
        const date = new Date(d.date);
        return date >= new Date(filters.dateStart) && date <= new Date(filters.dateEnd);
      });
    }
    if (filters.department) {
      filtered = filtered.filter((d) => (d.employee?.department || "-") === filters.department);
    }
    if (filters.employee) {
      filtered = filtered.filter((d) => (d.employee?.name || "").toLowerCase().includes(filters.employee.toLowerCase()));
    }
    setFilteredData(filtered);
  }, [filters, data]);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await AttendanceService.getAllAttendances();
      if (res.status === 200 && Array.isArray(res.data.data)) {
        const normalized = res.data.data.map(normalizeAttendance);
        if (isMounted.current) setData(normalized);
      } else {
        setAlert({ show: true, title: "Error", text: "Failed to fetch attendance data.", success: false });
      }
    } catch (e) {
      setAlert({ show: true, title: "Error", text: "Failed to fetch attendance data.", success: false });
    }
    setLoading(false);
  };

  const getDepartments = async () => {
    setDepartments(["HR", "IT", "Finance", "Marketing"]);
  };

  const handleUpload = async (file?: File) => {
    if (!file) {
      setAlert({ show: true, title: "Error", text: "No file selected.", success: false });
      return;
    }
    setUploading(true);
    setAlert({ show: true, title: "Uploading...", text: "Uploading attendance data...", success: true });
    setTimeout(() => {
      setUploading(false);
      setAlert({ show: true, title: "Success", text: "Attendance data uploaded successfully!", success: true });
      setUploadModalOpen(false);
      setProcess((p) => !p);
    }, 1500);
  };

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => setAlert((a) => ({ ...a, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  const columns = [
    { key: "employee", label: "Employee Name" },
    { key: "check_in", label: "Check-in Time" },
    { key: "check_out", label: "Check-out Time" },
    { key: "status", label: "Status" },
    { key: "work_hours_week", label: "Weekly Hours" },
    { key: "work_hours_month", label: "Monthly Hours" },
    { key: "actions", label: "Actions" },
  ];

  const addWorkHours = (rows: Attendance[]) => {
    return rows.map((row) => {
      let week = 40, month = 160;
      let hours = 0;
      if (row.check_in && row.check_out && row.check_in !== "-" && row.check_out !== "-") {
        const [inH, inM] = row.check_in.split(":").map(Number);
        const [outH, outM] = row.check_out.split(":").map(Number);
        if (!isNaN(inH) && !isNaN(inM) && !isNaN(outH) && !isNaN(outM)) {
          hours = (outH + outM / 60) - (inH + inM / 60);
          if (hours < 0) hours = 0;
          week = Math.round(hours * 5 * 100) / 100;
          month = Math.round(hours * 20 * 100) / 100;
        }
      }
      return {
        ...row,
        work_hours_week: week + "h",
        work_hours_month: month + "h",
      };
    });
  };

  const paginatedRows = filteredData.length > 0 ? filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage) : [];
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const renderRows = (rows: Attendance[]) => {
    return addWorkHours(rows).map((row, idx) => (
      <tr key={row.id || idx} className="border-b dark:border-gray-700">
        <td className="py-2 px-3">{row.employee?.name || "-"}</td>
        <td className="py-2 px-3">{row.check_in || "-"}</td>
        <td className="py-2 px-3">{row.check_out || "-"}</td>
        <td className="py-2 px-3">
          <span className={`px-2 py-1 rounded text-xs font-semibold 
            ${row.status === "present" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" : ""}
            ${row.status === "late" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" : ""}
            ${row.status === "absent" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200" : ""}
            ${row.status === "leave" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200" : ""}
          `}>{row.status || "-"}</span>
        </td>
        <td className="py-2 px-3">{row.work_hours_week}</td>
        <td className="py-2 px-3">{row.work_hours_month}</td>
        <td className="py-2 px-3">
          <Button
            size="sm"
            variant="outline"
            startIcon={<EyeIcon />}
            onClick={() => router.push(`/attendance/${row.id || ""}`)}
          >
            View Details
          </Button>
        </td>
      </tr>
    ));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "attendance":
        return (
          <ComponentCard
            suffix={
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  startIcon={<HiArrowDownOnSquare />}
                  onClick={() => setUploadModalOpen(true)}
                >
                  Upload Attendance
                </Button>
                <Button
                  variant="outline"
                  startIcon={<DownloadIcon />}
                  onClick={() => exportToExcel(addWorkHours(filteredData), "Attendance_Data")}
                >
                  Export Excel
                </Button>
                <Button
                  variant="outline"
                  startIcon={<DownloadIcon />}
                  onClick={() => exportToPDF(addWorkHours(filteredData), "Attendance_Data")}
                >
                  Export PDF
                </Button>
              </div>
            }
          >
            <div className="flex flex-col md:flex-row gap-2 mb-4">
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={filters.dateStart}
                onChange={(e) => setFilters((f) => ({ ...f, dateStart: e.target.value }))}
                placeholder="Start Date"
              />
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={filters.dateEnd}
                onChange={(e) => setFilters((f) => ({ ...f, dateEnd: e.target.value }))}
                placeholder="End Date"
              />
              <select
                className="border rounded px-2 py-1"
                value={filters.department}
                onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))}
              >
                <option value="">All Departments</option>
                {departments.length > 0 ? departments.map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                )) : <option value="-">-</option>}
              </select>
              <input
                type="text"
                className="border rounded px-2 py-1"
                placeholder="Search Employee"
                value={filters.employee}
                onChange={(e) => setFilters((f) => ({ ...f, employee: e.target.value }))}
              />
            </div>
            <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
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
                    <tr>
                      <td colSpan={columns.length} className="text-center py-8 text-gray-400">Loading...</td>
                    </tr>
                  ) : paginatedRows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-8 text-gray-400">No attendance data found.</td>
                    </tr>
                  ) : (
                    renderRows(paginatedRows)
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Prev
                </Button>
                <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  Next
                </Button>
              </div>
            </div>
          </ComponentCard>
        );
      case "monthly":
        return (
          <ComponentCard>
            <div className="text-gray-600 dark:text-gray-300">Monthly Attendance Summary coming soon...</div>
          </ComponentCard>
        );
      case "late":
        return (
          <ComponentCard>
            <div className="text-gray-600 dark:text-gray-300">Late Employee Report coming soon...</div>
          </ComponentCard>
        );
      case "overtime":
        return (
          <ComponentCard>
            <div className="text-gray-600 dark:text-gray-300">Overtime Report coming soon...</div>
          </ComponentCard>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {alert.show && (
        <Alert
          title={alert.title}
          message={alert.text}
          variant={alert.success ? "success" : "error"}
        />
      )}
      <PageBreadcrumb pageTitle="Attendance" />
      <div className="flex gap-2 mb-4 mt-2">
        {TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "primary" : "outline"}
            onClick={() => setActiveTab(tab.key)}
            className="capitalize"
          >
            {tab.label}
          </Button>
        ))}
      </div>
      {renderTabContent()}
      <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)}>
        <div className="space-y-4">
          <div className="text-lg font-semibold">Upload Attendance Data</div>
          <input type="file" accept=".csv,.xlsx" className="block w-full" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
          {uploading && <div className="text-blue-500 text-sm">Uploading...</div>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setUploadModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
