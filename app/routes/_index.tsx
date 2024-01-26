import type { MetaFunction } from "@remix-run/node";
import { useRootLoaderData } from "~/root";
import { Report } from "~/types";

export const meta: MetaFunction = () => {
	return [
		{ title: "VoiceDeck" },
		{ name: "description", content: "Welcome to VoiceDeck!" },
	];
};

export default function Index() {
	const reports = useRootLoaderData();
	return (
		<div className="flex flex-col gap-10">
			<h1 className="text-7xl">VoiceDeck</h1>
			<h2 className="text-5xl">Reports</h2>
			{reports.map((report: Report) => (
				<div key={report.id}>
					<div>{report.id}</div>
					<div>{report.title}</div>
					<div>{report.summary}</div>
					<div>{report.image.slice(0, 50)}</div>
					<div>{report.state}</div>
					<div>{report.category}</div>
					<div>{report.totalCost}</div>
					<div>{report.fundedSoFar}</div>
				</div>
			))}
		</div>
	);
}
