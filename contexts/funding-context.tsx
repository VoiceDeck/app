"use client";
import type { Claim } from "@/types";
import type { ClaimToken } from "@hypercerts-org/sdk";
import { type ReactNode, createContext, useContext } from "react";

// Define the shape of the context
interface FundingContextType {
	genesisFraction?: ClaimToken;
	hypercertClaim: Claim;
	pricePerUnit: number;
	totalUnits: number;
	totalAmount: number;
	// unitsRemaining: number;
	percentProgress: number;
	minUnitAmount: number;
	dollarAmountNeeded: string;
}

// Create the context with a default undefined value
const FundingContext = createContext<FundingContextType | undefined>(undefined);

// Context Provider component
export const FundingProvider: React.FC<{
	children: ReactNode;
	value: FundingContextType;
}> = ({ children, value }) => {
	return (
		<FundingContext.Provider value={value}>{children}</FundingContext.Provider>
	);
};

// Custom hook to use the context
export const useFunding = () => {
	const context = useContext(FundingContext);
	if (context === undefined) {
		throw new Error("useFunding must be used within a FundingProvider");
	}
	return context;
};
