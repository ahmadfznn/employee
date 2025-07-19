import React from "react";

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={"bg-white rounded-lg shadow p-4 " + (className || "")}>{children}</div>
);
