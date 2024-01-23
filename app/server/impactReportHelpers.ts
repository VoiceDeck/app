import {
	getHypercertClaims,
	getHypercertClient,
	getHypercertMetadata,
} from "~/server/hypercertHelpers";
import { Report } from "~/types";

let reports: Report[] | null = null;

/**
 * Generates a list of reports based on hypercert claims.
 * It fetches claims using `getHypercertClaims` from `hypercertHelpers.ts`
 * and then retrieves metadata for each claim using `getHypercertMetadata` from `hypercertHelpers.ts`.
 * @returns A promise that resolves to an array of reports.
 * @throws Throws an error if report generation fails.
 */
export const generateReports = async (): Promise<Report[]> => {
	try {
		const claims = await getHypercertClaims(getHypercertClient().indexer);
		const reports = await Promise.all(
			claims.map(async (claim) => {
				const metadata = await getHypercertMetadata(
					claim.uri as string,
					getHypercertClient().storage,
				);
				return {
					id: claim.id,
					title: metadata.name,
					description: metadata.description,
				};
			}),
		);

		return reports;
	} catch (error) {
		console.error(`Failed to generate report: ${error}`);
		throw new Error("Failed to generate report");
	}
};

/**
 * Fetches reports either from the cache or by generating them if not already cached.
 * It uses `generateReports` from `hypercertHelpers.ts` to generate reports if necessary.
 * @returns A promise that resolves to an array of reports.
 * @throws Throws an error if fetching reports fails.
 */
export const fetchReports = async (): Promise<Report[]> => {
	try {
		if (reports) {
			console.log("Reports already exist, no need to fetch from remote");
			console.log(`Existing reports: ${reports.length}`);
		} else {
			console.log("Fetching reports from remote");
			reports = await generateReports();
		}

		return reports;
	} catch (error) {
		console.error(`Failed to fetch reports: ${error}`);
		throw new Error("Failed to fetch reports");
	}
};
