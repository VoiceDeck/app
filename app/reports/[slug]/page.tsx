import FundingDataWrapper from "@/components/report-details/funding-data-wrapper";
import FundingProgress from "@/components/report-details/funding-progress";
import ReportSidebar from "@/components/report-details/report-sidebar";
import { Badge } from "@/components/ui/badge";
import { DynamicCategoryIcon } from "@/components/ui/dynamic-category-icon";
import { fetchReportBySlug } from "@/lib/impact-reports";
import type { Report } from "@/types";
import parse from "html-react-parser";
import { ChevronLeft, MapPin } from "lucide-react";
import Link from "next/link";

const getReportData = async (slug?: string | string[]) => {
	try {
		const reportData = await fetchReportBySlug(slug as string);
		return reportData;
	} catch (error) {
		console.error(`Error fetching report data for slug: ${slug}`, error);
		throw new Error(`Error fetching report data for slug: ${slug}`);
	}
};

export default async function ReportPage({
	params,
}: { params: { slug: string } }) {
	const { slug } = params;
	const report: Report = await getReportData(slug);
	const htmlParsedStory = parse(report.story ?? "");

	return (
		<main className="flex flex-col justify-between h-svh md:h-fit md:px-12 pt-6">
			{/* 192px is added to account for the funding progress on mobile */}
			<div className="flex flex-col gap-3 space-y-2 p-4 pb-[192px] md:pb-2 md:max-w-[1200px] md:mx-auto">
				<section className="flex flex-col flex-1 gap-4">
					<Link href={"/reports"} className="group flex space-x-1 items-center">
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
					<div className="fixed bottom-[72px] -mx-4 -my-4 md:relative md:bottom-auto md:mx-0 md:my-0 w-full">
						<FundingDataWrapper
							hypercertId={report.hypercertId}
							totalReportCost={report.totalCost}
						>
							<FundingProgress
								totalAmount={report.totalCost}
								fundedAmount={report.fundedSoFar}
								reportInfo={{
									image: report.image,
									title: report.title,
									hypercertId: report.hypercertId,
								}}
							/>
						</FundingDataWrapper>
					</div>
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
						{/* <ReportSupportFeed report={report} /> */}
					</section>
					<ReportSidebar report={report} />
				</section>
			</div>
		</main>
	);
}
