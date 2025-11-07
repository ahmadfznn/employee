import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AttendanceTable } from "@/components/attendance-table";

export default function Page() {
  return <AttendanceTable />;
}
