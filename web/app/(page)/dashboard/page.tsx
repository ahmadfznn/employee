import Calendar31 from "@/components/calendar-31";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { ChartBar } from "@/components/chart-bar";
import { ChartPie } from "@/components/chart-pie";
import { SectionCards } from "@/components/section-cards";

export default function Page() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-1 lg:px-6 xl:grid-cols-2">
        <ChartPie />
        <ChartBar />
      </div>
    </>
  );
}
