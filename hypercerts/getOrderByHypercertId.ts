import { graphql } from "@/lib/graphql";
import { HYPERCERTS_API_URL_GRAPH } from "@/config/hypercerts";
import request from "graphql-request";

const query = graphql(`
  query OrdersByHypercertId($hypercert_id: String) {
    orders(where: { hypercert_id: { eq: $hypercert_id } }) {
      data {
        additionalParameters
        amounts
        collection
        chainId
        createdAt
        collectionType
        currency
        endTime
        globalNonce
        hypercert_id
        id
        itemIds
        orderNonce
        price
        pricePerPercentInToken
        signature
        quoteType
        pricePerPercentInUSD
        signer
        strategyId
        subsetNonce
        validator_codes
        startTime
        invalidated
      }
    }
    
  }
`);

export async function getOrderByHypercertId(hypercertId: string) {
  const res = await request(HYPERCERTS_API_URL_GRAPH, query, {
    hypercert_id: hypercertId,
  });

  return {
    orders: res.orders?.data || [],
  };
}
