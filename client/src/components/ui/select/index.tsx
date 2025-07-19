import React from "react";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => (
  <select
    className="border rounded px-2 py-1 w-full"
    value={value}
    onChange={e => onValueChange(e.target.value)}
  >
    {children}
  </select>
);

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => (
  <option value={value}>{children}</option>
);
