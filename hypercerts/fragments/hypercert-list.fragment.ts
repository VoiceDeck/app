import { ResultOf, graphql } from "@/lib/graphql";

export const HypercertListFragment = graphql(`
  fragment HypercertListFragment on Hypercert {
    metadata {
      name
    }
    attestations {
      count
      data {
        data
      }
    }
    creation_block_number
    creation_block_timestamp
    last_update_block_number
    last_update_block_timestamp
    hypercert_id
    contract {
      chain_id
    }
    units
    orders {
      cheapestOrder {
        id
        price
        additionalParameters
        currency
        chainId
        pricePerPercentInUSD
        pricePerPercentInToken
      }
      totalUnitsForSale
      data {
        invalidated
      }
    }
  }
`);
export type HypercertListFragment = ResultOf<typeof HypercertListFragment>;
