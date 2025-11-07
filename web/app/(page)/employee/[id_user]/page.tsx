"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { DetailEmployee } from "@/components/detail-employee";
import { useParams } from "next/navigation";

export default function Page() {
  const { id_user }: { id_user: string } = useParams();

  return <DetailEmployee id_user={id_user} />;
}
