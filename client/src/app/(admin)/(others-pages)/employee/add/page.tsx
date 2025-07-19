import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddEmployeeForm from "@/components/form/form-elements/AddEmployeeForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function AddEmployee() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add Employee" />
      <div className="grid grid-cols-1">
        <div className="space-y-6">
          <AddEmployeeForm />
        </div>
      </div>
    </div>
  );
}
