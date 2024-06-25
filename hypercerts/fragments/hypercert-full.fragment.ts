import { ResultOf, graphql } from "@/lib/graphql";

export const HypercertFullFragment = graphql(`
  fragment HypercertFullFragment on Hypercert {
    metadata {
      name
      description
      external_url
      work_scope
      work_timeframe_from
      work_timeframe_to
      contributors
    }
    creation_block_number
    creation_block_timestamp
    last_update_block_number
    last_update_block_timestamp 
    hypercert_id
    contract {
      chain_id
      contract_address
    }
    creator_address
    units
    attestations {
      count
      data {
        data
        uid
        creation_block_number
        creation_block_timestamp
        last_update_block_number
        last_update_block_timestamp
        attester
      }
    }
    fractions {
      data {
        units
        owner_address
      }
    }
    token_id
  }
`);
export type HypercertFull = ResultOf<typeof HypercertFullFragment>;
