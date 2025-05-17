import React from "react";
import { cn } from "@/lib/utils";

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-2xl shadow-md bg-white border border-gray-200",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ className, children }) => {
  return (
    <div className={cn("p-4", className)}>
      {children}
    </div>
  );
};
