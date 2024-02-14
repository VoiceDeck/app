import { LoaderFunction, json } from "@remix-run/node";
import { MetaArgs, MetaFunction, useLoaderData } from "@remix-run/react";
import parse from "html-react-parser";
import { MapPin } from "lucide-react";
import DynamicCategoryIcon from "~/components/dynamic-category-icon";
import FundingProgress from "~/components/funding-progress";
import ReportSidebar from "~/components/report-sidebar";
import ReportSupportFeed from "~/components/report-support-feed";
import { Badge } from "~/components/ui/badge";
import { fetchReportBySlug } from "~/impact-reports.server";
import { Report } from "~/types";

export const meta: MetaFunction = ({ data }: MetaArgs) => {
	const report = data as Report;
	return [{ title: `VoiceDeck | ${report.title}` }];
};

export const loader: LoaderFunction = async ({ params }) => {
	const slug = params.slug;
	try {
		const response = await fetchReportBySlug(slug as string);

		return json(response);
	} catch (error) {
		console.error(`Failed to load impact report: ${error}`);
		throw new Response("Failed to load impact report", { status: 500 });
	}
};

export default function RouteComponent() {
	const response = useLoaderData<typeof loader>();
	const report = response as Report;
	const htmlParsedStory = report?.story ? parse(report.story) : "";

	return (
		<main className="flex flex-col border-2 border-red-100 justify-between h-svh">
			{/* 192px is added to account for the funding progress on mobile */}
			<div className="flex flex-col gap-2 space-y-2 p-4 pb-[192px]">
				<section className="flex flex-col flex-1 gap-4">
					<h5 className="font-semibold text-sm uppercase text-vd-blue-500 tracking-wider">
						Report
					</h5>
					<h1 className="font-semibold text-3xl tracking-tight">
						{report.title}
					</h1>
					<ul className="flex flex-wrap gap-1 space-x-3 items-center">
						<Badge>
							<DynamicCategoryIcon category={report.category} />
							<p>{report.category}</p>
						</Badge>
						<Badge>
							<MapPin color="#C14E41" strokeWidth={1} size={18} />
							<p>{report.state}</p>
						</Badge>
					</ul>
					{/* <FundingProgress totalAmount={100} fundedAmount={27} /> */}
					<p>{report.summary}</p>
					<img
						src={report.image}
						alt="Report illustration"
						className="rounded-2xl"
					/>

					<article className="prose">{htmlParsedStory}</article>
				</section>
				<ReportSidebar report={report} />
				<ReportSupportFeed report={report} />
			</div>
			<div className="fixed bottom-[56px] w-full shadow-lg">
				<FundingProgress totalAmount={100} fundedAmount={27} />
			</div>
		</main>
	);
}
