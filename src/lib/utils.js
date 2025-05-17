import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"; // ✅ esto es lo correcto

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
