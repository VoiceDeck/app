import type { LoaderFunctionArgs } from "@remix-run/node";
import {
	getHypercertClaims,
	getHypercertClient,
	getHypercertMetadata,
} from "~/server/hypercertHelpers";
import { Report } from "~/types";

let reports: Report[] | null = null;

const generateReports = async () => {
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

const fetchReports = async () => {
	if (reports) {
		console.log("Reports already exist, no need to fetch from remote");
		console.log(`Existing reports: ${reports.length}`);
	} else {
		console.log("Fetching reports from remote");
		reports = await generateReports();
	}

	return reports;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	try {
		const reports = await fetchReports();
		return new Response(JSON.stringify(reports), {
			status: 200,
			statusText: "OK",
		});
	} catch (error) {
		console.error(`Failed to load impact reports: ${error}`);
		return new Response(
			JSON.stringify({ error: "Failed to load impact reports" }),
			{
				status: 500,
				statusText: "Internal Server Error",
			},
		);
	}
};
