"use client";

import {
  IconPlaneDeparture,
  IconUserMinus,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmployeeService } from "@/services/EmployeeService";
import { LeaveRequestService } from "@/services/LeaveRequestService";
import { useEffect, useState } from "react";

export function SectionCards() {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [newHires, setNewHires] = useState(0);
  const [todayLeaves, setTodayLeaves] = useState(0);
  const [turnoverRate, setTurnoverRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const employeesRes = await EmployeeService.getAllEmployees();
        const total = employeesRes.data.data.length;
        setTotalEmployees(total);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newHiresCount = employeesRes.data.data.filter(
          (emp: { hire_date: string | number | Date }) => {
            const hireDate = new Date(emp.hire_date);
            return hireDate >= startOfMonth;
          }
        ).length;
        setNewHires(newHiresCount);

        const leavesRes = await LeaveRequestService.getAllLeaveRequests();
        setTodayLeaves(leavesRes.data.length);

        const separatedEmployeesCount = 1;
        const avgEmployees = (total + (total + separatedEmployeesCount)) / 2;
        const turnover = (separatedEmployeesCount / avgEmployees) * 100;
        setTurnoverRate(Number(turnover.toFixed(1)));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading dashboard data...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2 lg:px-6 xl:grid-cols-4">
      {/* Kartu Total Karyawan */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardDescription>Total Karyawan</CardDescription>
          <CardTitle className="flex items-center gap-2 text-3xl font-bold tabular-nums">
            {totalEmployees}
            <IconUsers className="w-6 h-6 text-gray-500" />
          </CardTitle>
          <CardAction>
            {/* badge bisa dihilangkan jika tidak perlu */}
          </CardAction>
        </CardHeader>
        <CardFooter className="mt-4 text-sm text-gray-500">
          <p>Jumlah total karyawan aktif saat ini.</p>
        </CardFooter>
      </Card>

      {/* Kartu Karyawan Baru Bulan Ini */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardDescription>Karyawan Baru Bulan Ini</CardDescription>
          <CardTitle className="flex items-center gap-2 text-3xl font-bold tabular-nums">
            {newHires}
            <IconUserPlus className="w-6 h-6 text-green-500" />
          </CardTitle>
          <CardAction></CardAction>
        </CardHeader>
        <CardFooter className="mt-4 text-sm text-gray-500">
          <p>Karyawan yang bergabung sejak awal bulan.</p>
        </CardFooter>
      </Card>

      {/* Kartu Tingkat Turnover */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardDescription>Tingkat Turnover</CardDescription>
          <CardTitle className="flex items-center gap-2 text-3xl font-bold tabular-nums">
            {turnoverRate}%
            <IconUserMinus className="w-6 h-6 text-red-500" />
          </CardTitle>
          <CardAction></CardAction>
        </CardHeader>
        <CardFooter className="mt-4 text-sm text-gray-500">
          <p>Persentase karyawan yang keluar.</p>
        </CardFooter>
      </Card>

      {/* Kartu Karyawan Cuti Hari Ini */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardDescription>Karyawan Cuti Hari Ini</CardDescription>
          <CardTitle className="flex items-center gap-2 text-3xl font-bold tabular-nums">
            {todayLeaves}
            <IconPlaneDeparture className="w-6 h-6 text-blue-500" />
          </CardTitle>
          <CardAction></CardAction>
        </CardHeader>
        <CardFooter className="mt-4 text-sm text-gray-500">
          <p>Jumlah karyawan yang sedang cuti atau izin.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
