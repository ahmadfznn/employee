import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CompanySettingForm from "@/components/form/form-elements/CompanySettingForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function CompanySetting() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Company Setting" />
      <div className="grid grid-cols-1">
        <div className="space-y-6">
          <CompanySettingForm />
        </div>
      </div>
    </div>
  );
}
