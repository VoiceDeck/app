import {
	getHypercertClaims,
	getHypercertClient,
	getHypercertMetadata,
} from "~/server/hypercertHelpers";
import { Report } from "~/types";

let reports: Report[] | null = null;

/**
 * Fetches reports either from the cache or by generating them if not already cached.
 * @returns A promise that resolves to an array of reports.
 * @throws Throws an error if fetching reports fails.
 */
export const fetchReports = async (ownerAddress: string): Promise<Report[]> => {
	try {
		if (reports) {
			console.log("Reports already exist, no need to fetch from remote");
			console.log(`Existing reports: ${reports.length}`);
		} else {
			console.log("Fetching reports from remote");
			const claims = await getHypercertClaims(
				ownerAddress,
				getHypercertClient().indexer,
			);
			reports = await Promise.all(
				claims.map(async (claim) => {
					const metadata = await getHypercertMetadata(
						claim.uri as string,
						getHypercertClient().storage,
					);
					return {
						id: claim.id,
						title: metadata.name,
						description: metadata.description,
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
