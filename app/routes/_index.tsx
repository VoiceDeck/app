import { LoaderFunction, MetaFunction, json } from "@remix-run/node";
import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";
import { Report } from "~/types";
import { fetchReports } from "../impact-reports.server";

export const meta: MetaFunction = () => {
	return [
		{ title: "VoiceDeck" },
		{ name: "description", content: "Welcome to VoiceDeck!" },
	];
};

export const loader: LoaderFunction = async () => {
	const ownerAddress = process.env.HC_OWNER_ADDRESS;
	if (!ownerAddress)
		throw new Error("Owner address environment variable is not set");
	try {
		const response = await fetchReports(ownerAddress);
		return json(response);
	} catch (error) {
		console.error(`Failed to load impact reports: ${error}`);
		throw new Response("Failed to load impact reports", { status: 500 });
	}
};

export const clientLoader = (args: ClientLoaderFunctionArgs) =>
	cacheClientLoader(args);

clientLoader.hydrate = true;

export default function Index() {
	const cacheData = useCachedLoaderData<typeof loader>();
	const reports = cacheData?.reports ?? [];
	// const { reports } = useLoaderData<typeof loader>();

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
