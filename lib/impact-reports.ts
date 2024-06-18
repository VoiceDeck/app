import "server-only";

import {
	HypercertClaimdata,
	HypercertClient,
	type HypercertMetadata,
} from "@hypercerts-org/sdk";
import { Mutex } from "async-mutex";

import type { Claim, Report } from "@/types";
import { getCMSReports, getFundedAmountByHCId } from "./directus";
import { getOrders } from "./marketplace";
import { delay } from "./utils";

let reports: Report[] | null = null;
let claims: Claim[] | null = null;
const reportsMutex = new Mutex();

let hypercertClient: HypercertClient | null = null;

/**
 * Fetches reports either from the cache or by generating them if not already cached.
 * @returns A promise that resolves to an array of reports.
 * @throws Throws an error if fetching reports fails.
 */
export const fetchReports = async (): Promise<Report[]> => {
	if (!process.env.HC_OWNER_ADDRESS) {
		throw new Error("[server] Owner address environment variable is not set");
	}
	const ownerAddress = process.env.HC_OWNER_ADDRESS;

	try {
		if (reports) {
			console.log(
				"[server] Reports already exist, no need to fetch from remote",
			);
			console.log(`[server] Existing reports: ${reports.length}`);
		} else {
			console.log(
				`[server] Fetching reports from remote using owner address: ${ownerAddress}`,
			);
			claims = await getHypercertClaims(ownerAddress);

			const _reports = await updateReports();

			// step 3: get orders from marketplace
			const orders = await getOrders(_reports);

			// TODO: remove this when we don't need dummy order
			if (process.env.DEPLOY_ENV === "production") {
				reports = _reports.map((report) => {
					for (const order of orders) {
						if (order && order.hypercertId === report.hypercertId) {
							report.order = order;
							break;
						}
					}

					if (!report.order && report.fundedSoFar < report.totalCost) {
						// warn if there is no order for a report that is not fully funded
						console.warn(
							`[server] No order found for hypercert ${report.hypercertId}`,
						);
					}
					return report;
				});
			} else {
				reports = _reports.map((report) => {
					for (const order of orders) {
						if (order) {
							report.order = order;
							break;
						}
					}
					// warn if there is no order for a report that is not fully funded
					if (!report.order && report.fundedSoFar < report.totalCost) {
						console.warn(
							`[server] No order found for hypercert ${report.hypercertId}`,
						);
					}
					return report;
				});
			}
			console.log(`[server] total fetched reports: ${reports.length}`);
		}

		return reports;
	} catch (error) {
		console.error(`[server] Failed to fetch reports: ${error}`);
		throw new Error(`[server] Failed to fetch reports: ${error}`);
	}
};

/**
 * Fetches a report by its slug.
 * @param slug - The slug of the report to fetch.
 * @returns A promise that resolves to the report.
 * @throws Throws an error if the report with the specified slug is not found.
 */
export const fetchReportBySlug = async (slug: string): Promise<Report> => {
	try {
		const reports = await fetchReports();

		const foundReport = reports.find((report: Report) => report.slug === slug);
		if (!foundReport) {
			throw new Error(`[server] Report with slug '${slug}' not found.`);
		}

		return foundReport;
	} catch (error) {
		console.error(`[server] Failed to get report by slug ${slug}: ${error}`);
		throw new Error(`[server] Failed to get report by slug ${slug}: ${error}`);
	}
};

export const fetchReportByHCId = async (
	hypercertId: string,
): Promise<Report> => {
	try {
		const reports = await fetchReports();

		const foundReport = reports.find(
			(report: Report) => report.hypercertId === hypercertId,
		);
		if (!foundReport) {
			throw new Error(
				`[server] Report with hypercert Id '${hypercertId}' not found.`,
			);
		}

		return foundReport;
	} catch (error) {
		throw new Error(
			`[server] Failed to get report with hypercert Id '${hypercertId}': ${error}`,
		);
	}
};

export const getReports = (): Report[] => {
	if (reports) {
		return reports;
	}
	return [];
};

/**
 * Retrieves the singleton instance of the HypercertClient.
 * @returns The HypercertClient instance.
 */
export const getHypercertClient = (): HypercertClient => {
	if (hypercertClient) {
		return hypercertClient;
	}

	hypercertClient = new HypercertClient({ environment: "test" }); // Sepolia testnet

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
): Promise<Claim[]> => {
	if (claims) {
		console.log("[server] Claims already exist, no need to fetch from remote");
		console.log(`[server] Existing claims: ${claims.length}`);
	} else {
		try {
			console.log(`[Hypercerts] Fetching claims owned by ${ownerAddress}`);

			// see graphql query: https://github.com/hypercerts-org/hypercerts/blob/d7f5fee/sdk/src/indexer/queries/claims.graphql#L1-L11
			const response = await getHypercertClient().indexer.hypercertsByOwner({
				owner: ownerAddress,
			});
			if (!response || !response) {
				return [];
			}
			console.log("Response", response);
			claims = response.hypercerts.data as Claim[];
			console.log(`[Hypercerts] Fetched claims: ${claims ? claims.length : 0}`);
		} catch (error) {
			console.error(
				`[Hypercerts] Failed to fetch claims owned by ${ownerAddress}: ${error}`,
			);
			throw new Error(
				`[Hypercerts] Failed to fetch claims owned by ${ownerAddress}: ${error}`,
			);
		}
	}

	return claims;
};

export const fetchNewReports = async () => {
	if (!process.env.HC_OWNER_ADDRESS) {
		throw new Error("[server] Owner address environment variable is not set");
	}

	const ownerAddress = process.env.HC_OWNER_ADDRESS;
	const response = await getHypercertClient().indexer.hypercertsByOwner({
		owner: ownerAddress,
	});
	const newClaims = response?.hypercerts.data as Claim[];
	console.log("New Claims", newClaims);

	console.log("[server] update new reports if there are new claims");
	if (claims && newClaims.length === claims.length) {
		console.log("[server] no new claims, no need to update reports");
		return;
	}

	if (!claims || newClaims.length > claims.length) {
		console.log("[server] claims in the cache are outdated, updating reports");
		claims = newClaims;

		await updateReports();
	}
};

const updateReports = async (): Promise<Report[]> => {
	if (!claims) {
		throw new Error(
			"[server] Claims are not fetched yet, please fetch claims first.",
		);
	}

	const fromCMS = await getCMSReports();

	const existingReportIds = reports
		? reports.map((report) => report.hypercertId)
		: [];

	const reportsToUpdatePromises = claims
		.filter((claim) => !existingReportIds.includes(claim.id))
		.map(async (claim, index) => {
			console.log(`[server] Processing claim with ID: ${claim.id}.`);

			// a delay to spread out the requests
			await delay(index * 20);

			// step 1: get metadata from IPFS
			const metadata = await getHypercertMetadata(
				claim.uri as string,
				getHypercertClient().storage,
			);

			// step 2: get offchain data from CMS

			const cmsReport = fromCMS.find(
				(cmsReport) => cmsReport.title === metadata.name,
			);
			if (!cmsReport) {
				throw new Error(
					`[server] CMS content for report titled '${metadata.name}' not found.`,
				);
			}

			return {
				hypercertId: claim.id,
				title: metadata.name,
				summary: metadata.description,
				image: metadata.image,
				originalReportUrl: metadata.external_url,
				state: metadata.properties?.[0].value,
				category: metadata.hypercert?.work_scope.value?.[0],
				workTimeframe: metadata.hypercert?.work_timeframe.display_value,
				impactScope: metadata.hypercert?.impact_scope.display_value,
				impactTimeframe: metadata.hypercert?.impact_timeframe.display_value,
				contributors: metadata.hypercert?.contributors.value?.map(
					(name) => name,
				),
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
				fundedSoFar: await getFundedAmountByHCId(claim.id),
			} as Report;
		});

	const reportsToUpdate = await Promise.all(reportsToUpdatePromises);

	if (reportsToUpdate.length > 0) {
		console.log(
			`[server] Found ${reportsToUpdate.length} new. Updating reports...`,
		);
		reports = [...(reports || []), ...reportsToUpdate];
		console.log(`[server] Reports updated. Total reports: ${reports.length}`);
	} else {
		console.log(
			"[server] No new or updated claims found. No need to update reports.",
		);
	}

	return reports as Report[];
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
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	storage: any,
): Promise<HypercertMetadata> => {
	let metadata: HypercertMetadata | null;

	try {
		const response = await storage.getMetadata(claimUri);
		metadata = response;
		if (!metadata) {
			throw new Error("No metadata found");
		}

		return metadata;
	} catch (error) {
		console.error(
			`[Hypercerts] Failed to fetch metadata of ${claimUri}: ${error}`,
		);
		throw new Error(
			`[Hypercerts] Failed to fetch metadata of ${claimUri}: ${error}`,
		);
	}
};

// update the fundedSoFar field of the report
export const updateFundedAmount = async (
	hypercertId: string,
	amount: number,
): Promise<void> => {
	const release = await reportsMutex.acquire();

	try {
		const reports = getReports();
		const report = reports.find((r) => r.hypercertId === hypercertId);
		if (report) {
			report.fundedSoFar += amount;
		}
	} finally {
		release();
	}
};
