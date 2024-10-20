import "server-only";

import { graphql, readFragment } from "@/lib/graphql";

import { HYPERCERTS_API_URL_GRAPH } from "@/config/hypercerts";
// import { HypercertListFragment } from "@/hypercerts/fragments/hypercert-list.fragment";
import { HypercertFullFragment } from "@/hypercerts/fragments/hypercert-full.fragment";
import request from "graphql-request";
import { getAddress } from "viem";
import { FragmentOf } from "gql.tada";

const query = graphql(
  `
    query AllHypercerts($where: HypercertsWhereArgs) {
      hypercerts(where: $where) {
        count
        data {
          ...HypercertFullFragment
        }
      }
    }
  `,
  [HypercertFullFragment],
);

export async function getHypercertsByOwner({
  ownerAddress,
}: {
  ownerAddress: string;
}) {
  try {
    const queryRes = await request(HYPERCERTS_API_URL_GRAPH, query, {
      where: { fractions: { owner_address: { eq: getAddress(ownerAddress) } } },
    });

    if (!queryRes.hypercerts?.data) return undefined;

    return {
      count: queryRes.hypercerts.count ?? 0,
      data:
        queryRes.hypercerts.data.map((hypercert) =>
          readFragment(HypercertFullFragment, hypercert),
        ) || [],
    };
  } catch (e) {
    console.error(`[getHypercertsByOwner] Error: ${(e as Error).message}`);
    return undefined;
  }
}

export type HypercertsByOwnerResult =
  | {
      count: number;
      data: FragmentOf<typeof HypercertFullFragment>[];
    }
  | undefined;
