import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import React from "react";

interface ComponentCardProps {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  previousAction?: String;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  prefix,
  suffix,
  children,
  className = "",
  desc = "",
  previousAction = "",
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="">
          <div className="flex items-center space-x-3 text-gray-800 dark:text-white/90">
            {previousAction != "" && (
              <Link href="/employee">
                <ChevronLeftIcon />
              </Link>
            )}
            {prefix}
          </div>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        {suffix}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
