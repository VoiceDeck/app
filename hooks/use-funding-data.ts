"use client";
import type { Claim, Report } from "@/types";
import { type ClaimToken, HypercertClient } from "@hypercerts-org/sdk";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { sepolia } from "viem/chains";
import { usePublicClient } from "wagmi";

type UseFetchFundingDataReturnType = {
  genesisFractionQuery: UseQueryResult<Record<"claimTokens", ClaimToken[]>>;
  hypercertClaimQuery: UseQueryResult<Record<"claim", Claim>>;
};

export const useFetchFundingData = (
  hypercertId: Partial<Report>["hypercertId"]
): UseFetchFundingDataReturnType => {
  const publicClient = usePublicClient({ chainId: sepolia.id });

  const { indexer } = new HypercertClient({
    chain: { id: sepolia.id }, // Sepolia testnet
    // @ts-ignore
    publicClient,
  });

  const fractionQuery: Partial<UseFetchFundingDataReturnType>["genesisFractionQuery"] =
    useQuery({
      queryKey: ["hypercerts", "fractions", "id", hypercertId],
      queryFn: () =>
        indexer.fractionsByClaim(
          hypercertId as string
        ),
    });

  const claimByIdQuery: Partial<UseFetchFundingDataReturnType>["hypercertClaimQuery"] =
    useQuery({
      queryKey: ["hypercerts", "claim", "id", hypercertId],
      queryFn: () =>
        indexer.claimById(
          hypercertId as string
        ),
    });

  return {
    genesisFractionQuery: fractionQuery,
    hypercertClaimQuery: claimByIdQuery,
  };
};
