import type { HypercertData } from "@/types";
import { createClient } from "./server";
import type { Error as PostgresError } from "postgres";
import { getHypercertIds } from "../google/getHypercertIds";

type GetHypercertsResponse = {
	data: HypercertData[];
	error: PostgresError | null;
};

export const fetchHypercerts = async (): Promise<GetHypercertsResponse> => {
	const hypercertIds = await getHypercertIds();
	if (!hypercertIds) {
		throw new Error("No hypercert IDs found");
	}
	const supabase = createClient();

	if (!hypercertIds) {
		throw new Error("No hypercert IDs found");
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
	  fractions!inner (id,units, owner_address)
	`)
		.in("hypercert_id", hypercertIds);

	return {
		data: data as HypercertData[],
		error: error as PostgresError | null,
	};
};
