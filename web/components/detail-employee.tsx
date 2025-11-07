"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconCash,
  IconUser,
  IconBriefcase,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { EmployeeService } from "@/services/EmployeeService";
import { useEffect, useState } from "react";
import { Employee } from "./employee-table";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

export function DetailEmployee({ id_user }: { id_user: string }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const res = await EmployeeService.getEmployeeById(id_user);
        setEmployee(res.data.data);
      } catch (err) {
        setError("Failed to load employee data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id_user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading employee data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>No employee data found.</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 lg:px-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Kolom Kiri: Info Dasar & Profil */}
        <div className="md:col-span-1">
          <Card className="text-center">
            <CardContent className="flex flex-col items-center">
              <Avatar className="mb-4 h-24 w-24">
                <AvatarImage
                  src={
                    employee.photo_url ||
                    `https://ui-avatars.com/api/?name=${employee.name}&background=random&color=fff`
                  }
                  alt={employee.name}
                />
                <AvatarFallback>
                  {employee.name
                    ? employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : ""}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl font-bold">
                {employee.name}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {employee.position}
              </CardDescription>
              <div className="mt-4 flex gap-2">
                <div className="flex items-center gap-1">
                  <IconMail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs">{employee.email}</p>
                </div>
                <div className="flex items-center gap-1">
                  <IconPhone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs">{employee.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Detail & Informasi Tambahan */}
        <div className="md:col-span-2 space-y-6">
          {/* Card untuk Employment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconBriefcase className="h-5 w-5" /> Detail Pekerjaan
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <CardDescription>Departemen</CardDescription>
                <p className="font-medium">{employee.department}</p>
              </div>
              <div>
                <CardDescription>Posisi</CardDescription>
                <p className="font-medium">{employee.position}</p>
              </div>
              <div>
                <CardDescription>Tanggal Bergabung</CardDescription>
                <p className="font-medium">
                  {/* {new Date(employee.hire_date).toLocaleDateString("id-ID")} */}
                </p>
              </div>
              <div>
                <CardDescription>Peran (Role)</CardDescription>
                <p className="font-medium capitalize">{employee.role}</p>
              </div>
            </CardContent>
          </Card>

          {/* Card untuk Informasi Pribadi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconUser className="h-5 w-5" /> Informasi Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <CardDescription>Alamat</CardDescription>
                <p className="font-medium">{employee.address || "N/A"}</p>
              </div>
              <div>
                <CardDescription>ID Karyawan</CardDescription>
                <p className="font-medium">{employee.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Card untuk Informasi Keuangan & Administrasi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconCash className="h-5 w-5" /> Keuangan & Administrasi
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <CardDescription>Gaji Pokok</CardDescription>
                <p className="font-medium">{formatCurrency(employee.salary)}</p>
              </div>
              <div>
                <CardDescription>Status Pembayaran</CardDescription>
                <p className="font-medium text-green-500">Paid</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
