"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditEmployeeForm from "@/components/form/form-elements/EditEmployeeForm";
import { EmployeeService } from "@/services/EmployeeService";
import { Employee } from "@/types";
import { Metadata } from "next";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function EditEmployee() {
  const { id }: { id: string } = useParams();

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Employee" />
      <div className="grid grid-cols-1">
        <div className="space-y-6">
          <EditEmployeeForm id={id!} />
        </div>
      </div>
    </div>
  );
}
