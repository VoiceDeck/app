import { ResultOf, graphql } from "gql.tada";
import { HypercertFullFragment } from "@/hypercerts/fragments/hypercert-full.fragment";

export const getHypercertsByHypercertIdQuery = graphql(`
  query GetHypercertByHypercertId($hypercert_id: String!) {
    hypercerts(where: { hypercert_id: { contains: $hypercert_id } }) {
      data {
        creator_address
        hypercert_id
        units
        contract {
          chain_id
        }
        orders {
          totalUnitsForSale
          lowestAvailablePrice
        }
        metadata {
          allow_list_uri
          contributors
          external_url
          description
          image
          impact_scope
          work_timeframe_from
          work_timeframe_to
          work_scope
          name
        }
      }
    }
  }
`);

export type GetHypercertsByHypercertId = ResultOf<typeof getHypercertsByHypercertIdQuery>;

export const hypercertsByCreatorQuery = graphql(`
  query GetHypercertsByCreator($address: String!) {
    hypercerts(
      sort: { by: { claim_attestation_count: descending } }
      where: { creator_address: { contains: $address } }
      count: COUNT
    ) {
      count
      data {
				id
        hypercert_id
        units
        uri
        creator_address
        contract {
          chain_id
        }
        metadata {
          id
          name
          description
          image
          external_url
          work_scope
          contributors
          work_timeframe_from
          work_timeframe_to
        }
      }
    }
  }
`);

export type HypercertsByCreatorQuery = ResultOf<typeof hypercertsByCreatorQuery>;

export const getFractionsByOwnerQuery = graphql(`
  query GetFractionsByOwner($address: String!) {
    fractions(where: { owner_address: { contains: $address } }, count: COUNT) {
      count
      data {
        id
        fraction_id
        owner_address
        units
        metadata {
          id
          name
          description
          image
          external_url
          work_scope
          contributors
          work_timeframe_from
          work_timeframe_to
        }
      }
    }
  }
`);

export type GetFractionsByOwner = ResultOf<typeof getFractionsByOwnerQuery>;
