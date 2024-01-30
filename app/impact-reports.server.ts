import {
	ClaimsByOwnerQuery,
	HypercertClient,
	HypercertIndexerInterface,
	HypercertMetadata,
	HypercertsStorage,
} from "@hypercerts-org/sdk";
import { Claim, Report } from "~/types";

let reports: Report[] | null = null;
let hypercertClient: HypercertClient | null = null;

/**
 * Fetches reports either from the cache or by generating them if not already cached.
 * @returns A promise that resolves to an array of reports.
 * @throws Throws an error if fetching reports fails.
 */
export const fetchReports = async (ownerAddress: string): Promise<Report[]> => {
	try {
		if (reports) {
			console.log(
				`[📃] --REPORTS-- ${reports.length} already cached, no need to fetch from remote`,
			);
		} else {
			console.log("Fetching reports from remote");
			const claims = await getHypercertClaims(
				ownerAddress,
				getHypercertClient().indexer,
			);
			reports = await Promise.all(
				claims.map(async (claim, index) => {
					const metadata = await getHypercertMetadata(
						claim.uri as string,
						getHypercertClient().storage,
					);
					return {
						id: claim.id,
						title: metadata.name,
						summary: metadata.description,
						image: metadata.image,
						// use hardcoded values for now
						// TODO: fetch from CMS or define type(or enum or whatever)
						state: index === 0 ? "Madhya Pradesh" : "Kerala",
						category: metadata.hypercert?.work_scope.value?.[0],
						// tentatively, it represent $1000
						totalCost: 1000,
						// TODO: fetch from blockchain when Hypercert Marketplace is ready
						fundedSoFar: Math.floor(Math.random() * 1000),
					} as Report;
				}),
			);
		}

		return reports;
	} catch (error) {
		console.error(`Failed to fetch reports: ${error}`);
		throw new Error("Failed to fetch reports");
	}
};

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
 * @param ownerAddress - The address of the owner of the claims.
 * @param indexer - An instance of HypercertIndexer to retrieve claims from the [Graph](https://thegraph.com/docs/en/)
 * @returns A promise that resolves to an array of claims.
 * @throws Will throw an error if the owner address is not set or the claims cannot be fetched.
 */
export const getHypercertClaims = async (
	ownerAddress: string,
	indexer: HypercertIndexerInterface,
): Promise<Claim[]> => {
	let claims: Claim[] | null;

	console.log(`Fetching claims owned by ${ownerAddress}`);
	try {
		// see graphql query: https://github.com/hypercerts-org/hypercerts/blob/d7f5fee/sdk/src/indexer/queries/claims.graphql#L1-L11
		const response = await indexer.claimsByOwner(ownerAddress as string, {
			orderDirections: "asc",
			first: 100,
			// skip the first 2 claims (they are dummy of 0x42FbF4d890B4EFA0FB0b56a9Cc2c5EB0e07C1536 in Sepolia testnet)
			skip: 2,
		});
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
