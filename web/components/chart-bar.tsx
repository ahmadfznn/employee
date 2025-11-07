"use client";

import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { EmployeeService } from "@/services/EmployeeService";
import { Employee } from "@/types/employee"; // Asumsi kamu memiliki tipe Employee di sini

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
}

// Interface untuk chart config
interface DynamicChartConfig {
  [key: string]: {
    label: string;
    color?: string;
  };
  count: {
    label: string;
    color: string;
  };
}

export function ChartBar() {
  // State untuk menyimpan data chart, konfigurasi, status loading, dan error
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [chartConfig, setChartConfig] = useState<DynamicChartConfig>({
    count: { label: "Employees", color: "hsl(var(--chart-1))" },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Mengambil semua data karyawan dari API
        const response = await EmployeeService.getAllEmployees();
        const employees: Employee[] = response.data.data;

        // Memproses data untuk menghitung jumlah karyawan per posisi
        // Menggunakan reduce untuk membuat objek dengan hitungan per posisi
        const positionCounts = employees.reduce(
          (acc: { [key: string]: number }, employee) => {
            // Mengambil posisi karyawan, jika tidak ada, gunakan "Unknown"
            const position = employee.position || "Unknown";
            // Menambah hitungan untuk posisi tersebut
            acc[position] = (acc[position] || 0) + 1;
            return acc;
          },
          {}
        );

        // Mengubah data menjadi format array yang dibutuhkan oleh Bar Chart
        const formattedData: ChartDataItem[] = Object.entries(
          positionCounts
        ).map(([position, count]) => ({
          name: position, // 'name' akan menjadi label di sumbu X
          count: count, // 'count' akan menjadi nilai bar
        }));

        // Mengupdate chartData dan chartConfig
        setChartData(formattedData);

        // Menyiapkan konfigurasi chart secara dinamis
        const dynamicChartConfig: DynamicChartConfig = {
          count: {
            label: "Employees",
            color: "hsl(var(--chart-1))",
          },
        };

        // Menambahkan label untuk setiap posisi di chartConfig
        formattedData.forEach((item) => {
          dynamicChartConfig[item.name] = {
            label: item.name,
          };
        });
        setChartConfig(dynamicChartConfig);
      } catch (err) {
        console.error("Failed to fetch employee data:", err);
        setError("Failed to load employee data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Dependensi kosong agar useEffect hanya berjalan sekali

  // Menampilkan pesan loading saat data sedang diambil
  if (isLoading) {
    return (
      <Card className="flex flex-col items-center justify-center p-8">
        <p>Loading employee data...</p>
      </Card>
    );
  }

  // Menampilkan pesan error jika gagal mengambil data
  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-red-500">
        <p>{error}</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee by Position</CardTitle>
        <CardDescription>
          Breakdown of employees by their job positions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig as ChartConfig}>
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name" // Menggunakan 'name' dari data (nama posisi)
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="count" // Menggunakan 'count' dari data (jumlah karyawan)
              fill="var(--color-employees)"
              radius={8}
            >
              <LabelList
                dataKey="count" // Menampilkan nilai 'count' di atas bar
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
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
