import { fetchReports } from "~/server/impactReportHelpers";

export const loader = async () => {
	const ownerAddress = process.env.HC_OWNER_ADDRESS;
	try {
		if (!ownerAddress) {
			throw new Error("Owner address environment variable is not set");
		}
		const reports = await fetchReports(ownerAddress);
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
