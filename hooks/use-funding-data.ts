"use client";
import { getFractionsByHypercert } from "@/hypercerts/getFractionsByHypercert";
import { getHypercert } from "@/hypercerts/getHypercert";
import type { Claim, Report } from "@/types";
import { type ClaimToken, HypercertClient } from "@hypercerts-org/sdk";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { sepolia } from "viem/chains";
import { usePublicClient } from "wagmi";

type UseFetchFundingDataReturnType = {};

export const useFetchFundingData = (
  hypercertId: Partial<Report>["hypercertId"],
) => {
  if (!hypercertId) {
    throw new Error("hypercertId is required");
  }
  // const publicClient = usePublicClient({ chainId: sepolia.id });

  // const { indexer } = new HypercertClient({
  //   chain: { id: sepolia.id }, // Sepolia testnet
  //   // @ts-ignore
  //   publicClient,
  // });

  const fractionQuery = useQuery({
    queryKey: ["hypercerts", "fractions", "id", hypercertId],
    queryFn: () => getFractionsByHypercert(hypercertId),
  });

  const claimByIdQuery = useQuery({
    queryKey: ["hypercerts", "claim", "id", hypercertId],
    queryFn: () => getHypercert(hypercertId),
  });

  return {
    genesisFractionQuery: fractionQuery,
    hypercertClaimQuery: claimByIdQuery,
  };
};
