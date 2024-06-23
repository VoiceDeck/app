import type { HypercertData } from "@/types";
import { createClient } from "./server";
import type { Error as PostgresError } from "postgres";
import { getHypercertIds } from "../google/getHypercertIds";
import { graphql } from "gql.tada";
import { HYPERCERTS_API_URL } from "@/config/graphql";
import request from "graphql-request";
import { getHypercertsByHypercertIdQuery } from "@/graphql/queries";

export const fetchHypercerts = async () => {
	try {
		const hypercertIds = await getHypercertIds();
		if (!hypercertIds) {
			const errorMessage = "No hypercert IDs found (status code: 404)";
			throw new Error(errorMessage);
		}
		console.log("Hypercert IDs", hypercertIds);

		const hypercertPromises = hypercertIds.map((hypercertId) =>
			request(HYPERCERTS_API_URL, getHypercertsByHypercertIdQuery, {
				hypercert_id: hypercertId,
			}),
		);
		const hypercertsData = await Promise.all(hypercertPromises);
		// Extract data from the first index of each hypercerts.data
		const hypercerts = hypercertsData.map(
			(hypercert) => hypercert?.hypercerts?.data?.[0] || null,
		);

		return {
			data: hypercerts.filter((hypercert) => hypercert != null),
		};
	} catch (error) {
		return {
			error: error as Error,
		};
	}
};
