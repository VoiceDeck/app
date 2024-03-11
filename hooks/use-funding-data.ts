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

// TODO: Use actual hypercert ID
export const useFetchFundingData = (
  hypercertId: Partial<Report>["hypercertId"]
): UseFetchFundingDataReturnType => {
  const publicClient = usePublicClient({ chainId: sepolia.id });

  const { indexer } = new HypercertClient({
    chain: { id: 11155111 }, // Sepolia testnet
    // @ts-ignore
    publicClient,
  });

  const fractionQuery: Partial<UseFetchFundingDataReturnType>["genesisFractionQuery"] =
    useQuery({
      queryKey: ["hypercerts", "fractions", "id", hypercertId],
      queryFn: () =>
        indexer.fractionsByClaim(
          // hypercertId
          "0xa16dfb32eb140a6f3f2ac68f41dad8c7e83c4941-39472754562828861761751454462085112528896"
        ),
    });

  const claimByIdQuery: Partial<UseFetchFundingDataReturnType>["hypercertClaimQuery"] =
    useQuery({
      queryKey: ["hypercerts", "claim", "id", hypercertId],
      queryFn: () =>
        indexer.claimById(
          // hypercertId
          "0xa16dfb32eb140a6f3f2ac68f41dad8c7e83c4941-39472754562828861761751454462085112528896"
        ),
    });

  return {
    genesisFractionQuery: fractionQuery,
    hypercertClaimQuery: claimByIdQuery,
  };
};
