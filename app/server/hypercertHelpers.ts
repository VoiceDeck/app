import {
	ClaimsByOwnerQuery,
	HypercertClient,
	HypercertIndexerInterface,
	HypercertMetadata,
	HypercertStorageInterface,
} from "@hypercerts-org/sdk";

let hypercertClient: HypercertClient | null = null;

export const getHypercertClient = () => {
	if (hypercertClient) {
		return hypercertClient;
	}
	hypercertClient = new HypercertClient({ chain: { id: 11155111 } }); // Sepolia testnet

	return hypercertClient;
};

export const getHypercertClaims = async (
	indexer: HypercertIndexerInterface,
) => {
	const ownerAddress = process.env.HC_OWNER_ADDRESS;
	let claims: ClaimsByOwnerQuery["claims"] | null;

	if (!ownerAddress) {
		throw new Error("Owner address environment variable is not set");
	}

	console.log(`Fetching claims owned by ${ownerAddress}`);
	try {
		const response = await indexer.claimsByOwner(ownerAddress as string);
		claims = (response as ClaimsByOwnerQuery).claims;
		console.log(`Fetched claims: ${claims ? claims.length : 0}`);

		return claims;
	} catch (error) {
		console.error(`Failed to fetch claims owned by ${ownerAddress}: ${error}`);
		throw new Error(`Failed to fetch claims claims owned by ${ownerAddress}`);
	}
};

export const getHypercertMetadata = async (
	claimUri: string,
	storage: HypercertStorageInterface,
) => {
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
