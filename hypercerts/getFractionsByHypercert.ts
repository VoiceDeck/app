//TODO server-only?
import { graphql, readFragment } from "@/lib/graphql";

import { HYPERCERTS_API_URL_GRAPH } from "@/config/hypercerts";
import { FractionStateFragment } from "@/hypercerts/fragments/fraction-state.fragment";
import request from "graphql-request";

const query = graphql(
  `
    query Fraction($hypercert_id: String!) {
      fractions(where: { hypercert_id: { eq: $hypercert_id } }) {
        count
        data {
          ...FractionStateFragment
        }
      }
    }
  `,
  [FractionStateFragment],
);

export async function getFractionsByHypercert(hypercertId: string) {
  const res = await request(HYPERCERTS_API_URL_GRAPH, query, {
    hypercert_id: hypercertId,
  });

  if (!res.fractions?.data) {
    return undefined;
  }

  const processedFragments = res.fractions.data.map((fraction) => {
    return readFragment(FractionStateFragment, fraction);
  });
  console.log("Processed Fragments", processedFragments);
  return {
    count: res.fractions.count,
    data: processedFragments,
  };
}
