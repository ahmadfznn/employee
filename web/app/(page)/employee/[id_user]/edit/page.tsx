"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { EditEmployeeForm } from "@/components/edit-employee-form";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";

export default function Page() {
  const { id_user }: { id_user: string } = useParams();

  return <EditEmployeeForm params={{ id_user }} />;
}
