import React, { useState } from "react";

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

const TabsContext = React.createContext<{
  value: string;
  setValue: (v: string) => void;
} | null>(null);

export const Tabs: React.FC<TabsProps> = ({ defaultValue, className, children }) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ className, children }) => (
  <div className={"flex gap-2 border-b mb-4 " + (className || "")}>{children}</div>
);

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children }) => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) return null;
  return (
    <button
      className={
        "px-4 py-2 font-medium border-b-2 " +
        (ctx.value === value ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-600")
      }
      onClick={() => ctx.setValue(value)}
      type="button"
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
  const ctx = React.useContext(TabsContext);
  if (!ctx || ctx.value !== value) return null;
  return <div className="pt-4">{children}</div>;
};
