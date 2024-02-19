import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
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
