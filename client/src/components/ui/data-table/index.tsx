import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../table/index";

interface Column {
  Header: string;
  accessor: string | ((row: any) => React.ReactNode);
  id?: string;
  Cell?: (props: { value: any; row: any }) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <Table className="">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.id || col.Header} isHeader className="px-4 py-2 text-left font-semibold">
                {col.Header}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                No data
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => (
              <TableRow key={i}>
                {columns.map((col, j) => {
                  let value = typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor];
                  if (col.Cell) {
                    return (
                      <TableCell key={col.id || col.Header + j} className="px-4 py-2">
                        {col.Cell({ value, row })}
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={col.id || col.Header + j} className="px-4 py-2">
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
