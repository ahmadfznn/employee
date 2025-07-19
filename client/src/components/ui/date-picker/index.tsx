import React from "react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, required }) => {
  return (
    <input
      type="date"
      className="border rounded px-2 py-1 w-full"
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
    />
  );
};
