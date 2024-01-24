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
						summary: metadata.description,
						image: metadata.image,
						// TODO: fetch from CMS or define type(or enum or whatever)
						state: "Madhya Pradesh",
						category: metadata.hypercert?.work_scope.value?.[0],
						// tentatively, it represent $1000
						totalCost: 1000,
						// TODO: fetch from blockchain
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
