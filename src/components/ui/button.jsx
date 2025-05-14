// src/components/ui/button.jsx
import React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  outline: "border border-gray-300 text-gray-800 hover:bg-gray-50",
  ghost: "text-gray-600 hover:bg-gray-100",
  link: "text-blue-600 hover:underline",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  success: "bg-green-600 text-white hover:bg-green-700",
};

const sizes = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2",
  lg: "px-5 py-3 text-lg",
};

export const Button = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
