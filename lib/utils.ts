import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Address } from "viem";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(d: Date) {
	const date = new Date(Number(d) * 1000);
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
	length = 4,
): string => {
	if (!address) {
		return "";
	}
	if (address.length <= 2 + length * 2) {
		return address;
	}
	return `${address.substring(0, length + 2)}...${address.substring(
		address.length - length,
	)}`;
};

export const isNotNull = <T>(value: T | null): value is T => {
	return value !== null;
};

export const delay = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const isValidEthereumAddress = (address: string) =>
	/^0x[a-fA-F0-9]{40}$/.test(address);

export const calculateBigIntPercentage = (
	numerator: bigint | string | null | undefined,
	denominator: bigint | string | null | undefined,
) => {
	if (!numerator || !denominator) {
		return undefined;
	}
	return Number((BigInt(numerator) * BigInt(100)) / BigInt(denominator));
};
