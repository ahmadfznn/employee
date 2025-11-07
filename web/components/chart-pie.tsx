"use client";

import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { LabelList, Pie, PieChart } from "recharts";
import { EmployeeService } from "@/services/EmployeeService";
import { Employee } from "@/types/employee"; // Pastikan path-nya sesuai

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Interface untuk data chart
interface ChartDataItem {
  name: string;
  count: number;
  fill: string;
}

// Interface untuk chart config
interface DynamicChartConfig {
  [key: string]: {
    label: string;
    color?: string;
  };
  count: {
    label: string;
  };
}

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export function ChartPie() {
  // Menentukan tipe data untuk state
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [chartConfig, setChartConfig] = useState<DynamicChartConfig>({
    count: { label: "Total Employees" },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await EmployeeService.getAllEmployees();
        const employees: Employee[] = response.data.data;

        // Mendefinisikan tipe data untuk accumulator (acc)
        const positionCounts = employees.reduce(
          (acc: { [key: string]: number }, employee) => {
            const position = employee.position || "Unknown";
            acc[position] = (acc[position] || 0) + 1;
            return acc;
          },
          {}
        );

        const formattedData: ChartDataItem[] = Object.entries(
          positionCounts
        ).map(([position, count]) => ({
          name: position,
          count: count as number,
          fill: getRandomColor(),
        }));

        const dynamicChartConfig: DynamicChartConfig = {
          count: {
            label: "Total Employees",
          },
        };
        formattedData.forEach((item) => {
          dynamicChartConfig[item.name] = {
            label: item.name,
            color: item.fill,
          };
        });

        setChartData(formattedData);
        setChartConfig(dynamicChartConfig);
      } catch (err) {
        console.error("Failed to fetch employee data:", err);
        setError("Failed to load employee data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card className="flex flex-col items-center justify-center p-8">
        <p>Loading employee data...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-red-500">
        <p>{error}</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Employee by Position</CardTitle>
        <CardDescription>
          Breakdown of employees by their job positions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig as ChartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="name" />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="name"
              strokeWidth={5}
            >
              <LabelList
                dataKey="name"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: string) => chartConfig[value]?.label}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Total Employees:{" "}
          {chartData.reduce((sum, item) => sum + item.count, 0)}
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-muted-foreground leading-none">
          Data pulled from the employee database
        </div>
      </CardFooter>
    </Card>
  );
}
