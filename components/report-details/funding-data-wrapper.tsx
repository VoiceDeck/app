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

	const genesisFraction = genesisFractionResponse?.data[0];
	const hypercertClaim = hypercertClaimResponse?.metadata;

	if (fractionsPending || claimPending)
		return (
			<section className="h-20 shadow-md max-w-3xl flex justify-center items-center bg-vd-beige-100 gap-2 rounded-lg ease-in duration-300">
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
