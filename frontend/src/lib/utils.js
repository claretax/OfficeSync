import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
// utils/dateFormatter.js

export function formatDate(dateInput, format = "dd mmm yy") {
  const date = new Date(dateInput);

  if (isNaN(date)) {
    throw new Error("Invalid date input");
  }

  const day = String(date.getDate()).padStart(2, "0");
  const monthIndex = date.getMonth(); // 0-based
  const year = String(date.getFullYear()).slice(-2); // Get last 2 digits

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthNumeric = String(monthIndex + 1).padStart(2, "0");
  const monthText = monthNames[monthIndex];

  switch (format.toLowerCase()) {
    case "dd mmm yy":
      return `${day} ${monthText} ${year}`;
    case "dd-mm-yy":
      return `${day}-${monthNumeric}-${year}`;
    default:
      throw new Error("Unsupported format. Use 'dd mmm yy' or 'dd-mm-yy'.");
  }
}
