"use client";
import type { Report } from "@/types";
import { HypercertClient } from "@hypercerts-org/sdk";
import { useQuery } from "@tanstack/react-query";
import { sepolia } from "viem/chains";
import { usePublicClient } from "wagmi";

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

	const fractionQuery = useQuery({
		queryKey: ["hypercerts", "fractions", "id", hypercertId],
		queryFn: () =>
			indexer.fractionsByHypercert({
				hypercertId: hypercertId as string,
			}),
	});

	const claimByIdQuery = useQuery({
		queryKey: ["hypercerts", "claim", "id", hypercertId],
		queryFn: () => indexer.hypercertById({ id: hypercertId as string }),
	});

	return {
		genesisFractionQuery: fractionQuery,
		hypercertClaimQuery: claimByIdQuery,
	};
};
