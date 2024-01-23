import {
	ClaimsByOwnerQuery,
	HypercertClient,
	HypercertIndexerInterface,
	HypercertMetadata,
	HypercertsStorage,
} from "@hypercerts-org/sdk";
import { Claim } from "~/types";

let hypercertClient: HypercertClient | null = null;

/**
 * Retrieves the singleton instance of the HypercertClient.
 * @returns The HypercertClient instance.
 */
export const getHypercertClient = (): HypercertClient => {
	if (hypercertClient) {
		return hypercertClient;
	}
	hypercertClient = new HypercertClient({ chain: { id: 11155111 } }); // Sepolia testnet

	return hypercertClient;
};

/**
 * Fetches the claims owned by the specified address from the Hypercert indexer.
 * @param indexer - An instance of HypercertIndexer to retrieve claims from the [Graph](https://thegraph.com/docs/en/)
 * @returns A promise that resolves to an array of claims.
 * @throws Will throw an error if the owner address is not set or the claims cannot be fetched.
 */
export const getHypercertClaims = async (
	indexer: HypercertIndexerInterface,
): Promise<Claim[]> => {
	const ownerAddress = process.env.HC_OWNER_ADDRESS;
	let claims: Claim[] | null;

	if (!ownerAddress) {
		throw new Error("Owner address environment variable is not set");
	}

	console.log(`Fetching claims owned by ${ownerAddress}`);
	try {
		// see graphql query: https://github.com/hypercerts-org/hypercerts/blob/d7f5fee/sdk/src/indexer/queries/claims.graphql#L1-L11
		const response = await indexer.claimsByOwner(ownerAddress as string);
		claims = (response as ClaimsByOwnerQuery).claims as Claim[];
		console.log(`Fetched claims: ${claims ? claims.length : 0}`);

		return claims;
	} catch (error) {
		console.error(`Failed to fetch claims owned by ${ownerAddress}: ${error}`);
		throw new Error(`Failed to fetch claims claims owned by ${ownerAddress}`);
	}
};

/**
 * Retrieves the metadata for a given claim URI from IPFS.
 * @param claimUri - The IPFS URI of the claim for which metadata is to be fetched.
 * @param storage - An instance of HypercertsStorage to retrieve metadata from IPFS.
 * @returns A promise that resolves to the metadata of the claim.
 * @throws Will throw an error if the metadata cannot be fetched.
 */
export const getHypercertMetadata = async (
	claimUri: string,
	storage: HypercertsStorage,
): Promise<HypercertMetadata> => {
	let metadata: HypercertMetadata | null;

	try {
		const response = await storage.getMetadata(claimUri);
		metadata = response;

		return metadata;
	} catch (error) {
		console.error(`Failed to fetch metadata of ${claimUri}: ${error}`);
		throw new Error(`Failed to fetch metadata of ${claimUri}`);
	}
};
