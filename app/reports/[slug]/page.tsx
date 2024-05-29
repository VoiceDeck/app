import FundingDataWrapper from "@/components/report-details/funding-data-wrapper";
import FundingProgress from "@/components/report-details/funding-progress";
import ReportSidebar from "@/components/report-details/report-sidebar";
import ReportSupportFeed from "@/components/report-details/report-support-feed";
import { Badge } from "@/components/ui/badge";
import { DynamicCategoryIcon } from "@/components/ui/dynamic-category-icon";
import { Separator } from "@/components/ui/separator";
import { getContributionsByHCId } from "@/lib/directus";
import { fetchReportBySlug } from "@/lib/impact-reports";
import type { Report } from "@/types";
import parse from "html-react-parser";
import { ChevronLeft, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface ReportPageProps {
	params: { slug: string };
}

const getReportData = async (slug?: string | string[]) => {
	try {
		const reportData = await fetchReportBySlug(slug as string);
		return reportData;
	} catch (error) {
		throw new Error(`Error fetching report data for slug: ${slug}`);
	}
};

const getContributionsByHypercertId = async (
	hypercertId: Partial<Report>["hypercertId"],
) => {
	if (!hypercertId) return null;
	try {
		const contributionsData = await getContributionsByHCId(hypercertId);
		return contributionsData || [];
	} catch (error) {
		throw new Error(
			`Error fetching contributions for hypercertId: ${hypercertId}`,
		);
	}
};

export async function generateMetadata({
	params,
}: ReportPageProps): Promise<Metadata> {
	const report = await getReportData(params.slug);
	const metadata: Metadata = {
		title: report.title,
		description: report.summary,
		openGraph: {
			title: report.title,
			description: report.summary,
			images: report.image ? [{ url: report.image }] : [],
		},
	};
	return metadata;
}

export default async function ReportPage({ params }: ReportPageProps) {
	const { slug } = params;
	const report = await getReportData(slug);
	const contributions = await getContributionsByHypercertId(report.hypercertId);
	const htmlParsedStory = report.story ? parse(report.story) : null;
	// console.log({ report });
	return (
		<main className="flex flex-col justify-between h-svh md:h-fit md:px-12 pt-6">
			{/* 192px is added to account for the funding progress on mobile */}
			<div className="flex flex-col gap-3 space-y-2 p-4 pb-[256px] md:pb-8 md:max-w-[1200px] md:mx-auto">
				<section className="flex flex-col flex-1 gap-4">
					<Link href={"/reports"} className="group flex space-x-1 items-center">
						<ChevronLeft
							size={24}
							className="text-vd-blue-400 group-hover:-translate-x-2 transition-transform duration-300 ease-in-out"
						/>
						<p className="font-semibold text-sm uppercase text-vd-blue-500 tracking-wider">
							All contributions
						</p>
					</Link>

					<h1 className="font-bold text-3xl md:text-4xl tracking-tight">
						{report.title}
					</h1>
					<ul className="flex flex-wrap gap-1 space-x-3 items-center">
						<Badge className="hover:bg-vd-beige-200 pointer-events-none">
							<DynamicCategoryIcon category={report.category} />
							<p>{report.category}</p>
						</Badge>
						<Badge className="hover:bg-vd-beige-200 pointer-events-none">
							<MapPin color="#C14E41" strokeWidth={1} size={18} />
							<p>{report.state}</p>
						</Badge>
					</ul>
					<div className="fixed bottom-[96px] -mx-4 -my-4 md:relative md:bottom-auto md:mx-0 md:my-0 w-full">
						<FundingDataWrapper
							hypercertId={report.hypercertId}
							totalAmount={report.totalCost}
							fundedAmount={report.fundedSoFar}
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
						<div className="relative rounded-2xl md:h-[420px] h-[358px] w-full overflow-hidden">
							<Image
								src={report.image}
								alt="Report illustration"
								className="-z-10 object-cover bg-center"
								fill
							/>
						</div>
						{htmlParsedStory && (
							<article className="prose text-vd-blue-900">
								{htmlParsedStory}
							</article>
						)}
					</section>
					<div>
						<Separator className="block md:hidden my-6 md:my-0 bg-stone-300" />
						<ReportSidebar report={report} />
					</div>
				</section>
				{contributions && (
					<div>
						<Separator className="block md:hidden my-6 bg-stone-300" />
						<ReportSupportFeed contributions={contributions} />
					</div>
				)}
			</div>
		</main>
	);
}
