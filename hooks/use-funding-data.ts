"use client";
import type { Claim, Report } from "@/types";
import { HypercertClient } from "@hypercerts-org/sdk";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { sepolia } from "viem/chains";
import { usePublicClient } from "wagmi";

// ! Commented out types for now, I believe that React Query should infer the types

// type UseFetchFundingDataReturnType = {
// 	genesisFractionQuery: UseQueryResult<Record<"claimTokens", ClaimToken[]>>;
// 	hypercertClaimQuery: UseQueryResult<Record<"claim", Claim>>;
// };

export const useFetchFundingData = (
	hypercertId: Partial<Report>["hypercertId"],
	// ): UseFetchFundingDataReturnType => {
) => {
	const publicClient = usePublicClient({ chainId: sepolia.id });

	const { indexer } = new HypercertClient({
		chain: { id: sepolia.id }, // Sepolia testnet
		// @ts-ignore
		publicClient,
	});

	// const fractionQuery: Partial<UseFetchFundingDataReturnType>["genesisFractionQuery"] =
	const fractionQuery = useQuery({
		queryKey: ["hypercerts", "fractions", "id", hypercertId],
		queryFn: () =>
			indexer.fractionsByHypercert({
				hypercertId: hypercertId as string,
			}),
	});

	// const claimByIdQuery: Partial<UseFetchFundingDataReturnType>["hypercertClaimQuery"] =
	const claimByIdQuery = useQuery({
		queryKey: ["hypercerts", "claim", "id", hypercertId],
		queryFn: () => indexer.hypercertById({ id: hypercertId as string }),
	});

	return {
		genesisFractionQuery: fractionQuery,
		hypercertClaimQuery: claimByIdQuery,
	};
};
