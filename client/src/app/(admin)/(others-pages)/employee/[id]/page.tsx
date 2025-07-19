"use client";

import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { EmployeeService } from "@/services/EmployeeService";
import { Employee } from "@/types";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HiChevronLeft } from "react-icons/hi2";

// export const metadata: Metadata = {
//   title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };

export default function DetailEmployee() {
  const [data, setData] = useState<Employee>();
  const { id }: { id: string } = useParams();
  const router = useRouter();

  useEffect(() => {
    EmployeeService.getEmployeeById(id).then((res) => {
      setData(res.data.data);
    });
  }, []);

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex gap-2 items-center mb-5">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
          >
            <HiChevronLeft />
          </button>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Detail Employee
          </h3>
        </div>
        <div className="space-y-6">
          <UserMetaCard data={data!} type="detail" />
          <UserInfoCard data={data!} type="detail" />
          <UserAddressCard data={data!} type="detail" />
        </div>
      </div>
    </div>
  );
}
