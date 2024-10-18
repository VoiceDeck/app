"use client";
import { getFractionsByHypercert } from "@/hypercerts/getFractionsByHypercert";
import { getHypercert } from "@/hypercerts/getHypercert";
import type { Report } from "@/types";

import { useQuery } from "@tanstack/react-query";


export const useFetchFundingData = (
  hypercertId: Partial<Report>["hypercertId"],
) => {
  if (!hypercertId) {
    throw new Error("hypercertId is required");
  }


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
