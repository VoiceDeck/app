import "server-only";

import { graphql, readFragment } from "@/lib/graphql";

import { HYPERCERTS_API_URL_GRAPH } from "@/config/hypercerts";
import { HypercertListFragment } from "@/hypercerts/fragments/hypercert-list.fragment";
import request from "graphql-request";

const query = graphql(
  `
    query AllHypercerts($where: HypercertsWhereArgs) {
      hypercerts(where: $where) {
        count
        data {
          ...HypercertListFragment
        }
      }
    }
  `,
  [HypercertListFragment],
);

export async function getHypercertsByCreator({
  creatorAddress,
}: {
  creatorAddress: string;
}) {
  try {
    const queryRes = await request(HYPERCERTS_API_URL_GRAPH, query, {
      where: { creator_address: { eq: creatorAddress.toLowerCase() } },
    });

    if (!queryRes.hypercerts?.data) return undefined;

    return {
      count: queryRes.hypercerts.count ?? 0,
      data:
        queryRes.hypercerts.data.map((hypercert) =>
          readFragment(HypercertListFragment, hypercert),
        ) || [],
    };
  } catch (e) {
    console.error(`[getHypercertsByCreator] Error: ${(e as Error).message}`);
    return undefined;
  }
}
