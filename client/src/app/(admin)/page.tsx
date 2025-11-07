"use client";

import React, { useEffect, useState } from "react";
import EmployeeChart from "@/components/ecommerce/EmployeeChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import {
  FaUserTie,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaHourglassHalf,
  FaBell,
  FaUsers,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";

// Types
interface Notification {
  id: number;
  message: string;
}

interface DashboardData {
  totalEmployees: number;
  totalAttendances: number;
  pendingLeaveRequests: number;
  payrollSummary: number;
  recentNotifications: Notification[];
}

// Placeholder data fetching hooks (replace with real API calls)
function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({
        totalEmployees: 120,
        totalAttendances: 110,
        pendingLeaveRequests: 3,
        payrollSummary: 50000,
        recentNotifications: [
          { id: 1, message: "New employee added: John Doe" },
          { id: 2, message: "Payroll processed for June" },
          { id: 3, message: "Leave request pending approval" },
        ],
      });
    }, 1000); // Simulate initial loading
    const interval = setInterval(() => {
      setData({
        totalEmployees: 120,
        totalAttendances: 110,
        pendingLeaveRequests: 3,
        payrollSummary: 50000,
        recentNotifications: [
          { id: 1, message: "New employee added: John Doe" },
          { id: 2, message: "Payroll processed for June" },
          { id: 3, message: "Leave request pending approval" },
        ],
      });
    }, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return data;
}

export default function Dashboard() {
  const data = useDashboardData();

  // Placeholder: Replace with your actual theme logic (e.g., from context or a hook)
  const theme = "light"; // or "dark"

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const {
    totalEmployees,
    totalAttendances,
    pendingLeaveRequests,
    payrollSummary,
    recentNotifications,
  } = data;

  return (
    <div className="p-4 md:p-8">
      {/* Data Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-5 flex items-center gap-4">
          <FaUsers className="text-blue-500 text-3xl" />
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalEmployees}
            </div>
            <div className="text-gray-500 dark:text-gray-300 text-sm">
              Total Employees
            </div>
          </div>
        </section>
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-5 flex items-center gap-4">
          <FaCalendarCheck className="text-green-500 text-3xl" />
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalAttendances}
            </div>
            <div className="text-gray-500 dark:text-gray-300 text-sm">
              Today's Attendances
            </div>
          </div>
        </section>
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-5 flex items-center gap-4">
          <FaHourglassHalf className="text-yellow-500 text-3xl" />
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {pendingLeaveRequests}
            </div>
            <div className="text-gray-500 dark:text-gray-300 text-sm">
              Pending Leave Requests
            </div>
          </div>
        </section>
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-5 flex items-center gap-4">
          <FaMoneyBillWave className="text-purple-500 text-3xl" />
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${payrollSummary.toLocaleString()}
            </div>
            <div className="text-gray-500 dark:text-gray-300 text-sm">
              Payroll (This Month)
            </div>
          </div>
        </section>
      </div>

      {/* Notifications */}
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-5 mb-6">
        <div className="flex items-center gap-2 mb-3 text-lg font-semibold text-gray-700 dark:text-white">
          <FaBell className="text-yellow-500" /> Recent Notifications
        </div>
        <ul className="space-y-2">
          {recentNotifications.map((n) => (
            <li
              key={n.id}
              className="text-gray-600 dark:text-gray-200 text-sm flex items-center gap-2"
            >
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
              {n.message}
            </li>
          ))}
        </ul>
      </section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-5">
          <div className="mb-2 text-gray-700 dark:text-white font-semibold flex items-center gap-2">
            <FaCalendarCheck className="text-green-500" /> Attendance Trends
          </div>
          <StatisticsChart />
        </section>
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-5">
          <div className="mb-2 text-gray-700 dark:text-white font-semibold flex items-center gap-2">
            <FaUsers className="text-blue-500" /> Employee Performance
          </div>
          <EmployeeChart />
        </section>
      </div>
    </div>
  );
}
