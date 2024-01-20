import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Report } from "../model/report";
import { ReportService } from "../server/bootstrap.server";

export interface IReportLoader {
	reports: Report[];
}

export const loader = async (): Promise<IReportLoader> => {
	const reportService = await ReportService.getInstance();
	return { reports: reportService.getReports() };
};

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export default function Index() {
	const { reports } = useLoaderData<typeof loader>();
	return (
		<div>
			<h1 className="text-7xl">Impact Report</h1>
			<div className="text-xl">
				{reports.map((report) => {
					return (
						<div key={report.name}>
							-----
							<br />
							name: {report.name}
							<br />
							description: {report.description}
						</div>
					);
				})}
			</div>
		</div>
	);
}
