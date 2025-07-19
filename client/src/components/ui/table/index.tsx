import React, { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
  onClick?: () => void;
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={`bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 ${className}`}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
  onClick,
}) => {
  const CellTag = isHeader ? "th" : "td";
  return (
    <CellTag
      className={`px-4 py-2 ${isHeader ? "font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800" : "text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900"} border-b border-gray-200 dark:border-gray-700 ${className}`}
      onClick={onClick}
    >
      {children}
    </CellTag>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
