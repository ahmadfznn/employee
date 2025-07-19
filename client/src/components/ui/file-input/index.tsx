import React from "react";

interface FileInputProps {
  onChange: (file: File | null) => void;
  accept?: string;
}

export const FileInput: React.FC<FileInputProps> = ({ onChange, accept }) => {
  return (
    <input
      type="file"
      accept={accept}
      onChange={e => onChange(e.target.files?.[0] || null)}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
    />
  );
};
