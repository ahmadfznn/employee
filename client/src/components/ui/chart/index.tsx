import React from "react";

interface ChartProps {
  type: "bar" | "line";
  data: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor?: string[] }[] };
}

export const Chart: React.FC<ChartProps> = ({ type, data }) => {
  // Simple bar chart rendering for demonstration
  if (type === "bar") {
    const max = Math.max(...data.datasets[0].data, 1);
    return (
      <div className="w-full h-48 flex items-end gap-4 px-6 py-4 bg-gray-100 dark:bg-gray-900 rounded">
        {data.datasets[0].data.map((value, i) => (
          <div key={i} className="flex flex-col items-center w-12">
            <div
              className="w-full rounded-t bg-blue-500 dark:bg-blue-400 transition-all"
              style={{ height: `${(value / max) * 100}%`, minHeight: 8 }}
            ></div>
            <span className="mt-2 text-xs text-gray-700 dark:text-gray-200">
              {data.labels[i]}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{value}</span>
          </div>
        ))}
      </div>
    );
  }
  // Fallback for other chart types
  return (
    <div className="w-full h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded">
      <span className="text-gray-500 dark:text-gray-300">[Chart: {type}]</span>
    </div>
  );
};
