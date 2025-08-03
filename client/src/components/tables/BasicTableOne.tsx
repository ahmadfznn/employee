"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { formatDate } from "@/services/formatTime";
import Image from "next/image";

interface DataItem {
  [key: string]: any;
}

interface BasicTableProps {
  data: DataItem[];
  loading: boolean;
  excludedFields?: string[];
  itemsPerPage?: number;
  action?: (id: string) => React.ReactNode;
  onFieldClick?: (field: string, value: any, row: DataItem) => void;
}

export default function BasicTable({
  data,
  loading,
  excludedFields = [],
  itemsPerPage = 5,
  action,
  onFieldClick,
}: BasicTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  if (loading || data.length === 0) {
    return <p className="text-center">Loading or no data available...</p>;
  }

  if (!data || data.length === 0)
    return <p className="text-gray-500">No data available.</p>;

  const fields = Object.keys(data[0]).filter(
    (field) => !excludedFields.includes(field)
  );
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full">
        <div className="max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["no", ...fields, "action"].map((field) => (
                  <TableCell
                    key={field}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 whitespace-nowrap capitalize"
                  >
                    {field}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400 whitespace-nowrap">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>

                  {fields.map((field, i) => (
                    <TableCell
                      key={i}
                      className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400 whitespace-nowrap"
                      onClick={() =>
                        onFieldClick && onFieldClick(field, item[field], item)
                      }
                    >
                      {field === "photo profile" ? (
                        <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                          <Image
                            width={80}
                            height={80}
                            src="/images/user/owner.jpg"
                            alt="user"
                          />
                        </div>
                      ) : field === "salary" ? (
                        `Rp.${item[field].toLocaleString("id-ID")}`
                      ) : (field === "created at" || field === "updated at") &&
                        !isNaN(new Date(item[field]).getTime()) ? (
                        formatDate(item[field])
                      ) : typeof item[field] === "object" &&
                        item[field] !== null ? (
                        item[field].address ? (
                          item[field].address
                        ) : item[field].latitude && item[field].longitude ? (
                          `${item[field].latitude}, ${item[field].longitude}`
                        ) : (
                          JSON.stringify(item[field])
                        )
                      ) : (
                        item[field]
                      )}
                    </TableCell>
                  ))}

                  <TableCell className="px-4 py-3 text-center">
                    {action ? action(item.id) : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-white/[0.05]">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blue-500 dark:bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </Button>
        <span className="text-gray-500 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
