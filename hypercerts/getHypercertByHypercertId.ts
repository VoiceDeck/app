import request from "graphql-request";

import { getHypercertsByHypercertIdQuery } from "@/graphql/queries";

import { HYPERCERTS_API_URL } from "@/config/graphql";

export const getHypercertByHypercertId = async (hypercert_id: string) => {
	const res = await request(
		HYPERCERTS_API_URL,
		getHypercertsByHypercertIdQuery,
		{
			hypercert_id: hypercert_id,
		},
	);
	const data = res;
	if (!data.hypercerts.data || data.hypercerts.data[0].metadata === undefined) {
		return new Error("No hypercert found");
	}
	const hypercertData = data.hypercerts.data[0];
	return hypercertData;
};