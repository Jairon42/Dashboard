// src/components/ui/badge.jsx
import React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-gray-100 text-gray-800",
  secondary: "bg-gray-200 text-gray-700",
  destructive: "bg-red-100 text-red-800",
  success: "bg-green-100 text-green-800",
  outline: "border border-gray-300 text-gray-700",
};

export const Badge = ({ children, variant = "default", className = "" }) => {
  return (
    <span
      className={cn(
        "inline-block px-2 py-1 rounded-full text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
