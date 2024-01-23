import type { LoaderFunctionArgs } from "@remix-run/node";
import { fetchReports } from "~/server/impactReportHelpers";

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
