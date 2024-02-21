import { LoaderFunction } from "@remix-run/node";

import {
	ClientLoaderFunction,
	Link,
	MetaArgs,
	MetaFunction,
	useLoaderData,
} from "@remix-run/react";
import parse from "html-react-parser";
import { ChevronLeft, MapPin } from "lucide-react";
import FundingProgress from "~/components/report-details/funding-progress";
import ReportSidebar from "~/components/report-details/report-sidebar";
import ReportSupportFeed from "~/components/report-details/report-support-feed";
import { Badge } from "~/components/ui/badge";
import { DynamicCategoryIcon } from "~/components/ui/dynamic-category-icon";
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

		return { report: response };
	} catch (error) {
		console.error(`Failed to load impact report: ${error}`);
		throw new Response("Failed to load impact report", { status: 500 });
	}
};

// Cache reports individually in session storage in the browser for super fast
// back/forward/revisits during the session, but will fetch fresh data
// from the server if the user closes the tab and comes back later
export const clientLoader: ClientLoaderFunction = async ({
	serverLoader,
	params,
}) => {
	const cacheKey = `report-${params.slug}`;
	const cache = sessionStorage.getItem(cacheKey);
	if (cache) {
		console.log("Using cached report data");
		return { report: JSON.parse(cache) };
	}

	const { report } = await serverLoader<{ report: Report }>();
	sessionStorage.setItem(cacheKey, JSON.stringify(report));
	return { report };
};

export default function RouteComponent() {
	const { report } = useLoaderData<typeof loader>();
	const htmlParsedStory = report?.story ? parse(report.story) : "";

	return (
		<main className="flex flex-col justify-between h-svh md:h-fit md:px-12 pt-6">
			{/* 192px is added to account for the funding progress on mobile */}
			<div className="flex flex-col gap-3 space-y-2 p-4 pb-[192px] md:pb-2 md:max-w-[1200px] md:mx-auto">
				<section className="flex flex-col flex-1 gap-4">
					<Link to={"/reports"} className="group flex space-x-1 items-center">
						<ChevronLeft
							size={24}
							className="text-vd-blue-400 group-hover:-translate-x-2 transition-transform duration-300 ease-in-out"
						/>
						<p className="font-semibold text-sm uppercase text-vd-blue-500 tracking-wider">
							All Reports
						</p>
					</Link>

					<h1 className="font-bold text-3xl tracking-tight">{report.title}</h1>
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
					<div className="fixed bottom-[56px] -mx-4 -my-4 md:relative md:bottom-auto md:mx-0 md:my-0 w-full">
						<FundingProgress
							totalAmount={report.totalCost}
							fundedAmount={report.fundedSoFar}
						/>
					</div>
					{/* <Separator className="bg-vd-beige-300" /> */}
				</section>
				<section className="flex flex-col gap-2 md:flex-row md:gap-12 pt-8">
					<section className="flex flex-col gap-2">
						<div>
							<h3 className="font-bold text-2xl pb-3">Summary</h3>
							<p className="text-wrap leading-relaxed">{report.summary}</p>
						</div>
						<img
							src={report.image}
							alt="Report illustration"
							className="rounded-2xl md:h-[420px] md:object-cover md:w-full"
						/>

						<article className="prose text-vd-blue-900">
							{htmlParsedStory}
						</article>
						<ReportSupportFeed report={report} />
					</section>
					<ReportSidebar report={report} />
				</section>
			</div>
		</main>
	);
}
