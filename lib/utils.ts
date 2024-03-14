import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(d: Date) {
  const date = new Date(d);
  return date
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", // "Oct"
      day: "numeric",
    })
    .toUpperCase();
}

export const formatCurrency = (value: number, currencyCode = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(value);
};

export const truncateEthereumAddress = (
  address: `0x${string}`,
  length: number = 4,
): string => {
  if (!address) {
    return "";
  }
  if (address.length <= 2 + length * 2) {
    return address;
  }
  return `${address.substring(0, length + 2)}...${address.substring(address.length - length)}`;
};
