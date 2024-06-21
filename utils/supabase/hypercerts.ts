import type { HypercertData } from "@/types";
import { createClient } from "./server";
import type { Error as PostgresError } from "postgres";
import { getHypercertIds } from "../google/getHypercertIds";
import { graphql } from "gql.tada";
import { HYPERCERTS_API_URL } from "@/config/graphql";
import request from "graphql-request";

export type GetHypercertsResponse = {
	data: HypercertData[] | null;
	error: PostgresError | null;
};
const query = graphql(
	`
		query GetHypercertByHypercertId($hypercert_ids: [String!]) {
			hypercerts(
				where: {hypercert_id: {in: $hypercert_ids}}
			) {
				data {
					creator_address
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
		
	`,
);

const getHypercertByHypercertIds = async (hypercert_ids: string[]) => {
	const res = await request(HYPERCERTS_API_URL, query, {
		hypercert_ids: hypercert_ids,
	});
	const data = res;
	if (!data.hypercerts.data || data.hypercerts.data[0].metadata === null) {
		throw new Error("No hypercert found");
	}
	const hypercertData = data.hypercerts.data[0];
	return hypercertData;
};

export const fetchHypercerts = async (): Promise<GetHypercertsResponse> => {
	const hypercertIds = await getHypercertIds();
	if (!hypercertIds) {
		throw new Error("No hypercert IDs found");
	}
	console.log("Hypercert IDs", hypercertIds);
	const supabase = createClient();

	if (!supabase) {
		throw new Error("Supabase client is not initialized");
	}

	const { data, error } = await supabase
		.from("claims")
		.select(`
	  *,
	  metadata (
		allow_list_uri,
		contributors,
		description,
		external_url,
		id,
		image,
		impact_scope,
		impact_timeframe_from,
		impact_timeframe_to,
		name,
		parsed,
		properties,
		rights,
		uri,
		work_scope,
		work_timeframe_from,
		work_timeframe_to
	  ),
	  fractions!inner (id, units, owner_address, value)
	`)
		.in("hypercert_id", hypercertIds);

	return {
		data: data as HypercertData[],
		error: error as PostgresError | null,
	};
};

export type GetHypercertsByIdResponse = {
	data: HypercertData | null;
	error: PostgresError | null;
};

// TODO: Delete this as we migrated to GraphQL
export const fetchHypercertById = async (
	hypercert_id: string,
): Promise<GetHypercertsByIdResponse> => {
	const supabase = createClient();

	if (!supabase) {
		throw new Error("Supabase client is not initialized");
	}

	try {
		const { data, error } = await supabase
			.from("claims")
			.select(`
				*,
				metadata (
					allow_list_uri,
					contributors,
					description,
					external_url,
					id,
					image,
					impact_scope,
					impact_timeframe_from,
					impact_timeframe_to,
					name,
					parsed,
					properties,
					rights,
					uri,
					work_scope,
					work_timeframe_from,
					work_timeframe_to
				),
				fractions!inner (id, units, owner_address)
			`)
			.eq("hypercert_id", hypercert_id);

		const hypercertData = data?.[0];

		return {
			data: hypercertData as HypercertData,
			error: error as PostgresError | null,
		};
	} catch (error) {
		return {
			data: null,
			error: error as PostgresError,
		};
	}
};
