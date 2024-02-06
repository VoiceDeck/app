import {
	ClaimsByOwnerQuery,
	HypercertClient,
	HypercertIndexerInterface,
	HypercertMetadata,
	HypercertsStorage,
} from "@hypercerts-org/sdk";
import { CMSContent, Claim, Report } from "~/types";

let reports: Report[] | null = null;
// represents contents retrieved from CMS `reports` collection
let cmsContents: CMSContent[] | null = null;
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

					const fromCMS = await getCMSContents();
					const cmsReport = fromCMS.find(
						(cmsReport) => cmsReport.title === metadata.name,
					);
					if (!cmsReport) {
						throw new Error(
							`CMS content for report titled '${metadata.name}' not found.`,
						);
					}

					return {
						hypercertId: claim.id,
						title: metadata.name,
						summary: metadata.description,
						image: metadata.image,
						originalReportUrl: metadata.external_url,
						// first indice of `metadata.properties` holds the value of the state
						state: metadata.properties?.[0].value,
						category: metadata.hypercert?.work_scope.value?.[0],
						workTimeframe: metadata.hypercert?.work_timeframe.display_value,
						impactScope: metadata.hypercert?.impact_scope.display_value,
						impactTimeframe: metadata.hypercert?.impact_timeframe.display_value,
						contributors: metadata.hypercert?.contributors.value?.map(
							(name) => name,
						),

						// properties stored in CMS
						cmsId: cmsReport.id,
						status: cmsReport.status,
						dateCreated: cmsReport.date_created,
						slug: cmsReport.slug,
						story: cmsReport.story,
						bcRatio: cmsReport.bc_ratio,
						villagesImpacted: cmsReport.villages_impacted,
						peopleImpacted: cmsReport.people_impacted,
						verifiedBy: cmsReport.verified_by,
						dateUpdated: cmsReport.date_updated,
						byline: cmsReport.byline,
						totalCost: Number(cmsReport.total_cost),

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

/**
 * Fetches the contents of the CMS `reports` collection.
 * @returns A promise that resolves to an array of CMS contents.
 * @throws Will throw an error if the CMS contents cannot be fetched.
 */
export const getCMSContents = async (): Promise<CMSContent[]> => {
	try {
		if (cmsContents) {
			console.log("CMS contents already exist, no need to fetch from remote");
			console.log(`Existing CMS contents: ${cmsContents.length}`);
		} else {
			console.log("Fetching CMS contents from remote");
			const response = await fetch(process.env.CMS_ENDPOINT as string);
			if (!response.ok) {
				throw new Error(`failed to fetch data from CMS : ${response.status}`);
			}
			const data = await response.json();
			cmsContents = data.data as CMSContent[];
		}

		return cmsContents;
	} catch (error) {
		console.error(`Failed to fetch CMS contents: ${error}`);
		throw new Error("Failed to fetch CMS contents");
	}
};
