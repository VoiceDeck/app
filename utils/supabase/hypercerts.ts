import type { HypercertData } from "@/types";
import { createClient } from "./server";
import type { Error as PostgresError } from "postgres";

type GetHypercertsResponse = {
	data: HypercertData[];
	error: PostgresError | null;
};

export const fetchHypercerts = async (): Promise<GetHypercertsResponse> => {
	const supabase = createClient();
	const hypercertIds = [
		"11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-31986542490568215565557213098586211876864",
		"11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-31646260123647277102093838491154443665408",
		"11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-37771342728224169444434581424926271471616",
		"11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-37431060361303230980971206817494503260160",
	];

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
