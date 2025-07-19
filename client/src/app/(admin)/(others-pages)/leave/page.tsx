
"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Button from "@/components/ui/button/Button";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal/index";
import { Select, SelectItem } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Card } from "@/components/ui/card";
import { Chart } from "@/components/ui/chart";
import { FileInput } from "@/components/ui/file-input";
import { cn } from "@/lib/utils";

// Dummy data for demonstration
type LeaveRequest = {
  id: number;
  employee: string;
  start: string;
  end: string;
  type: string;
  status: string;
  reason: string;
  document: File | null;
};

const leaveRequests: LeaveRequest[] = [
  {
    id: 1,
    employee: "John Doe",
    start: "2024-06-01",
    end: "2024-06-05",
    type: "Annual",
    status: "Pending",
    reason: "Family vacation",
    document: null,
  },
  {
    id: 2,
    employee: "Jane Smith",
    start: "2024-05-10",
    end: "2024-05-12",
    type: "Sick",
    status: "Approved",
    reason: "Flu",
    document: null,
  },
  {
    id: 3,
    employee: "Alice Brown",
    start: "2024-04-20",
    end: "2024-04-22",
    type: "Maternity",
    status: "Rejected",
    reason: "Insufficient documentation",
    document: null,
  },
];

const leaveTypes = [
  { value: "Annual", label: "Annual" },
  { value: "Sick", label: "Sick" },
  { value: "Maternity", label: "Maternity" },
  { value: "Unpaid", label: "Unpaid" },
];

export default function LeaveManagementPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    type: "Annual",
    start: "",
    end: "",
    document: null as File | null,
  });
  const [requests, setRequests] = useState(leaveRequests);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Handlers
  const handleFormChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Validate and send to backend
    setRequests([
      ...requests,
      {
        id: requests.length + 1,
        employee: "Current User", // Replace with actual user
        start: form.start,
        end: form.end,
        type: form.type,
        status: "Pending",
        reason: "",
        document: form.document,
      },
    ]);
    setModalOpen(false);
    setForm({ type: "Annual", start: "", end: "", document: null });
  };

  const handleApprove = (id: number) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "Approved" } : req
      )
    );
  };

  const handleReject = (id: number) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "Rejected", reason: "Rejected by admin" } : req
      )
    );
  };

  // Table columns
  const columns = [
    {
      Header: "Employee Name",
      accessor: "employee",
    },
    {
      Header: "Leave Dates",
      accessor: (row: LeaveRequest) => `${row.start} → ${row.end}`,
      id: "dates",
    },
    {
      Header: "Leave Type",
      accessor: "type",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }: any) => (
        <span
          className={cn(
            "px-2 py-1 rounded text-xs font-medium",
            value === "Approved"
              ? "bg-green-100 text-green-700"
              : value === "Rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          )}
        >
          {value}
        </span>
      ),
    },
    {
      Header: "Actions",
      accessor: "id", // dummy accessor, not used
      id: "actions",
      Cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setSelectedRequest(row)}>
            View
          </Button>
          <Button
            size="sm"
            variant="primary"
            disabled={row.status !== "Pending"}
            onClick={() => handleApprove(row.id)}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={row.status !== "Pending"}
            onClick={() => handleReject(row.id)}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  // Statistics dummy data
  const stats = [
    { label: "Total Leaves", value: requests.length },
    { label: "Approved", value: requests.filter((r) => r.status === "Approved").length },
    { label: "Pending", value: requests.filter((r) => r.status === "Pending").length },
    { label: "Rejected", value: requests.filter((r) => r.status === "Rejected").length },
  ];

  // Rejected leaves
  const rejected = requests.filter((r) => r.status === "Rejected");

  return (
    <div className="p-6">
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="statistics">Leave Statistics</TabsTrigger>
          <TabsTrigger value="rejected">Rejected Leaves Report</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Leave Requests</h2>
            <Button onClick={() => setModalOpen(true)}>New Leave Request</Button>
          </div>
          <DataTable columns={columns} data={requests} />
        </TabsContent>
        <TabsContent value="statistics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6 flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow border border-gray-200 dark:border-gray-700">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-gray-500 dark:text-gray-400">{stat.label}</span>
              </Card>
            ))}
            <Card className="p-6 col-span-1 md:col-span-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow border border-gray-200 dark:border-gray-700">
              <Chart
                type="bar"
                data={{
                  labels: ["Approved", "Pending", "Rejected"],
                  datasets: [
                    {
                      label: "Requests",
                      data: [
                        stats[1].value,
                        stats[2].value,
                        stats[3].value,
                      ],
                      backgroundColor: [
                        "#22c55e",
                        "#eab308",
                        "#ef4444",
                      ],
                    },
                  ],
                }}
              />
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="rejected">
          <h2 className="text-xl font-semibold mb-4">Rejected Leaves Report</h2>
          <DataTable
            columns={[
              { Header: "Employee Name", accessor: "employee" },
              { Header: "Leave Dates", accessor: (row: LeaveRequest) => `${row.start} → ${row.end}`, id: "dates" },
              { Header: "Leave Type", accessor: "type" },
              { Header: "Reason", accessor: "reason" },
            ]}
            data={rejected}
          />
        </TabsContent>
      </Tabs>
      {/* Leave Request Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium">Leave Type</label>
            <Select
              value={form.type}
              onValueChange={(v) => handleFormChange("type", v)}
            >
              {leaveTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Start Date</label>
              <DatePicker
                value={form.start}
                onChange={(date) => handleFormChange("start", date)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">End Date</label>
              <DatePicker
                value={form.end}
                onChange={(date) => handleFormChange("end", date)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Supporting Document</label>
            <FileInput
              onChange={(file) => handleFormChange("document", file)}
              accept="application/pdf,image/*"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </Modal>
      {/* View Details Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      >
        {selectedRequest && (
          <div className="space-y-2">
            <div>
              <span className="font-medium">Employee:</span> {selectedRequest.employee}
            </div>
            <div>
              <span className="font-medium">Dates:</span> {selectedRequest.start} → {selectedRequest.end}
            </div>
            <div>
              <span className="font-medium">Type:</span> {selectedRequest.type}
            </div>
            <div>
              <span className="font-medium">Status:</span> {selectedRequest.status}
            </div>
            {selectedRequest.reason && (
              <div>
                <span className="font-medium">Reason:</span> {selectedRequest.reason}
              </div>
            )}
            {selectedRequest.document && (
              <div>
                <span className="font-medium">Document:</span> <a href={URL.createObjectURL(selectedRequest.document)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
