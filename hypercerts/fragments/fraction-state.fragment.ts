import { ResultOf, graphql } from "@/lib/graphql";

export const FractionStateFragment = graphql(`
  fragment FractionStateFragment on Fraction {
    creation_block_number
    creation_block_timestamp
    fraction_id
    hypercert_id
    last_update_block_number
    last_update_block_timestamp
    owner_address
    units
  }
`);


export type FractionStateFragment = ResultOf<typeof FractionStateFragment>;
