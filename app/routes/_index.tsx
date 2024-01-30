import type { MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { fetchReports } from "~/server/impactReportHelpers";
import { Report } from "~/types";

export const meta: MetaFunction = () => {
	return [
		{ title: "VoiceDeck" },
		{ name: "description", content: "Welcome to VoiceDeck!" },
	];
};

export const loader = async () => {
	const ownerAddress = process.env.HC_OWNER_ADDRESS;
	try {
		if (!ownerAddress) {
			throw new Error("Owner address environment variable is not set");
		}
		const response = await fetchReports(ownerAddress);
		return json(response);
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

export default function Index() {
	const reports = useLoaderData<typeof loader>();
	return (
		<div className="flex flex-col gap-10">
			<h1 className="text-7xl">VoiceDeck</h1>
			<h2 className="text-5xl">Reports</h2>
			{reports.map((report: Report) => (
				<div key={report.id}>
					<div>ID: {report.id}</div>
					<div>TTILE: {report.title}</div>
					<div>SUMMARY: {report.summary}</div>
					<div>IMAGE: {report.image.slice(0, 50)}</div>
					<div>STATE: {report.state}</div>
					<div>CATEGORY: {report.category}</div>
					<div>TOTAL COST: {report.totalCost}</div>
					<div>FUNDED SO FAR: {report.fundedSoFar}</div>
				</div>
			))}
		</div>
	);
}
