"use client";
import { FundingProvider } from "@/contexts/funding-context";
import { useFetchFundingData } from "@/hooks/use-funding-data";
import type { Report } from "@/types";
import { Loader2 } from "lucide-react";

interface FundingDataWrapperProps {
	hypercertId: Partial<Report>["hypercertId"];
	children: React.ReactNode;
	totalAmount: Partial<Report>["totalCost"];
	fundedAmount: Partial<Report>["fundedSoFar"];
}

const FundingDataWrapper: React.FC<FundingDataWrapperProps> = ({
	hypercertId,
	totalAmount,
	fundedAmount,
	children,
}: FundingDataWrapperProps) => {
	if (!hypercertId) {
		return <div>No hypercertId found </div>;
	}
	if (!totalAmount) {
		return <div>No total cost found</div>;
	}

	const { genesisFractionQuery, hypercertClaimQuery } =
		useFetchFundingData(hypercertId);

	const { data: genesisFractionResponse, isPending: fractionsPending } =
		genesisFractionQuery;
	const { data: hypercertClaimResponse, isPending: claimPending } =
		hypercertClaimQuery;

	const genesisFraction = genesisFractionResponse?.claimTokens[0];
	const hypercertClaim = hypercertClaimResponse?.claim;

	if (fractionsPending || claimPending)
		return (
			<section className="flex h-20 max-w-3xl items-center justify-center gap-2 rounded-lg bg-vd-beige-100 shadow-md duration-300 ease-in">
				<div className="animate-spin">
					<Loader2 size={18} />
				</div>
				Loading funding data...
			</section>
		);

	if (!hypercertClaim) {
		return <div>Missing data for calculations</div>;
	}

	const totalUnits = hypercertClaim.totalUnits;
	const pricePerUnit = totalAmount / Number(totalUnits);
	const percentProgress = ((fundedAmount || 0) / totalAmount) * 100;
	const minUnitAmount = 1 / pricePerUnit;
	const dollarAmountNeeded = (totalAmount - (fundedAmount || 0)).toFixed(2);

	return (
		<FundingProvider
			value={{
				genesisFraction,
				hypercertClaim,
				pricePerUnit,
				totalUnits,
				totalAmount,
				// unitsRemaining,
				percentProgress,
				minUnitAmount,
				dollarAmountNeeded,
			}}
		>
			{children}
		</FundingProvider>
	);
};

export default FundingDataWrapper;
