import type { HypercertData } from "@/types";
import { createClient } from "./server";
import type { Error as PostgresError } from "postgres";
import { getHypercertIds } from "../google/getHypercertIds";

export type GetHypercertsResponse = {
	data: HypercertData[] | null;
	error: PostgresError | null;
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
			.contains("hypercert_id", hypercert_id);

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
