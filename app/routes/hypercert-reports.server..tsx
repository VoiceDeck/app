import {
	ClaimsByOwnerQuery,
	HypercertClient,
	HypercertIndexerInterface,
	HypercertMetadata,
	HypercertStorageInterface,
} from "@hypercerts-org/sdk";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Report } from "~/types";

const createHypercertClient = () =>
	new HypercertClient({ chain: { id: 11155111 } }); // Sepolia testnet

const getHypercertClaims = async (indexer: HypercertIndexerInterface) => {
	let claims: ClaimsByOwnerQuery["claims"] | null;
	try {
		if (!process.env.HC_OWNER_ADDRESS) {
			throw new Error("Owner address environment variable is not set");
		}
		const response = await indexer.claimsByOwner(
			process.env.HC_OWNER_ADDRESS as string,
		);
		claims = (response as ClaimsByOwnerQuery).claims;
	} catch (error) {
		console.error("Failed to fetch claims by owner", error);
		throw new Error("Failed to fetch claims");
	}

	return claims;
};

const getHypercertMetadata = async (
	claimUri: string,
	storage: HypercertStorageInterface,
) => {
	let metadata: HypercertMetadata | null;

	try {
		const response = await storage.getMetadata(claimUri);
		metadata = response;
	} catch (error) {
		console.error("Failed to fetch metadata", error);
		throw new Error("Failed to fetch metadata");
	}

	return metadata;
};

const getHypercertReports = async (
	indexer: HypercertIndexerInterface,
	storage: HypercertStorageInterface,
) => {
	const reports = new Array<Report>();
	const errors = [];
	try {
		const claims = await getHypercertClaims(indexer);

		for (const claim of claims) {
			try {
				const metadata: HypercertMetadata = await getHypercertMetadata(
					claim.uri as string,
					storage,
				);

				reports.push({
					title: metadata.name,
					description: metadata.description,
					id: claim.id,
				});
			} catch (error) {
				errors.push(
					`Failed to fetch metadata for claim with ID ${claim.id}: ${error}`,
				);
			}
		}

		if (errors.length > 0) {
			console.error(
				"Errors occurred while fetching metadata for claims:",
				errors,
			);
		}

		return new Response(JSON.stringify(reports), {
			status: 200,
			statusText: "OK",
		});
	} catch (error) {
		console.error("Failed to fetch hypercert claims:", error);
		return new Response(
			JSON.stringify({ error: "Failed to fetch hypercert claims" }),
			{
				status: 500,
				statusText: "Could not fetch hypercert reports",
			},
		);
	}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { indexer, storage } = new HypercertClient({ chain: { id: 11155111 } });
	const response = await getHypercertReports(indexer, storage);
};
