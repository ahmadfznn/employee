import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { LeaveRequestTable } from "@/components/leave-request-table";

export default function Page() {
  return <LeaveRequestTable />;
}
