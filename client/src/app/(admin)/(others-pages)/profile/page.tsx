"use client";

import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { useAuth } from "@/context/AuthContext";
import { Employee } from "@/types";
import { Metadata } from "next";
import React, { useEffect } from "react";

// export const metadata: Metadata = {
//   title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };

export default function Profile() {
  const { user, loading }: { user: Employee; loading: boolean } = useAuth();

  useEffect(() => {}, [user, loading]);

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard data={user} type="profile" />
          <UserInfoCard data={user} type="profile" />
          <UserAddressCard data={user} type="profile" />
        </div>
      </div>
    </div>
  );
}
