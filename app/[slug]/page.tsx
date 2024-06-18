import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { graphql } from "gql.tada";
import request from "graphql-request";

import { ChevronLeft, MapPin } from "lucide-react";
import { graphqlEndpoint } from "@/config/graphql";
import { getContributionsByHCId } from "@/lib/directus";
import FundingDataWrapper from "@/components/report-details/funding-data-wrapper";
import FundingProgress from "@/components/report-details/funding-progress";
import ReportSidebar, {
	type SidebarData,
} from "@/components/report-details/report-sidebar";
import ReportSupportFeed from "@/components/report-details/report-support-feed";
import { Badge } from "@/components/ui/badge";
import { DynamicCategoryIcon } from "@/components/ui/dynamic-category-icon";
import { Separator } from "@/components/ui/separator";
import { fetchReportBySlug } from "@/lib/impact-reports";
import type { HypercertData, Report } from "@/types";
import { fetchHypercertById } from "@/utils/supabase/hypercerts";
import parse from "html-react-parser";

interface ReportPageProps {
	params: { slug: string };
}

const query = graphql(
	`
		query GetHypercertByHypercertId($hypercert_id: String!) {
			hypercerts(
				where: {hypercert_id: {contains: $hypercert_id}}
			) {
				data {
					creator_address
					metadata {
						allow_list_uri
						contributors
						external_url
						description
						image
						impact_scope
						work_timeframe_from
						work_timeframe_to
						work_scope
						name
					}
				}
			}
		}
		
	`,
);

const getHypercertByHypercertId = async (hypercert_id: string) => {
	const res = await request(graphqlEndpoint, query, {
		hypercert_id: hypercert_id,
	});
	const data = res;
	if (!data.hypercerts.data || data.hypercerts.data[0].metadata === null) {
		throw new Error("No hypercert found");
	}
	const hypercertData = data.hypercerts.data[0];
	return hypercertData;
};

// TODO: Delete this
const getHypercertData = async (slug: string) => {
	try {
		const hypercertData = await fetchHypercertById(slug);
		return hypercertData.data;
	} catch (error) {
		throw new Error(`Error fetching hypercert data for slug: ${slug}`);
	}
};

// Used By CMS Can be removed or refactored
const getContributionsByHypercertId = async (
	hypercert_id: Partial<HypercertData>["hypercert_id"],
) => {
	if (!hypercert_id) return null;
	try {
		const contributionsData = await getContributionsByHCId(hypercert_id);
		return contributionsData || [];
	} catch (error) {
		throw new Error(
			`Error fetching contributions for hypercertId: ${hypercert_id}`,
		);
	}
};

// export async function generateMetadata({
// 	params,
// }: ReportPageProps): Promise<Metadata> {
// 	const report = await getHypercertData(params.slug);
// const metadata: Metadata = {
// 	title: report.title,
// 	description: report.summary,
// 	openGraph: {
// 		title: report.title,
// 		description: report.summary,
// 		images: report.image ? [{ url: report.image }] : [],
// 	},
// };
// return metadata;
// }

export default async function ReportPage({ params }: ReportPageProps) {
	const { slug } = params;
	// const hypercertData = await getHypercertData(slug);
	const hypercertData = await getHypercertByHypercertId(slug);
	console.log("report", hypercertData);

	if (!hypercertData) {
		return <div>No hypercert found</div>;
	}
	// ! Below was used by CMS, can be removed or refactored
	// const contributions = await getContributionsByHypercertId(
	// 	report.hypercert_id,
	// );
	// const htmlParsedStory = report.story ? parse(report.story) : null;
	// console.log({ report });
	return (
		<main className="flex h-svh flex-col justify-between pt-6 md:h-fit md:px-12">
			{/* 192px is added to account for the funding progress on mobile */}
			<div className="flex flex-col gap-3 space-y-2 p-4 pb-[256px] md:mx-auto md:max-w-[1200px] md:pb-8">
				{!hypercertData.metadata ? (
					<section className="flex flex-1 flex-col gap-4">
						<Link href={"/"} className="group flex items-center space-x-1">
							<ChevronLeft
								size={24}
								className="group-hover:-translate-x-2 text-vd-blue-400 transition-transform duration-300 ease-in-out"
							/>
							<p className="font-semibold text-sm text-vd-blue-500 uppercase tracking-wider">
								All contributions
							</p>
						</Link>
					</section>
				) : (
					<>
						<section className="flex flex-1 flex-col gap-4">
							<Link href={"/"} className="group flex items-center space-x-1">
								<ChevronLeft
									size={24}
									className="group-hover:-translate-x-2 text-vd-blue-400 transition-transform duration-300 ease-in-out"
								/>
								<p className="font-semibold text-sm text-vd-blue-500 uppercase tracking-wider">
									All contributions
								</p>
							</Link>

							<h1 className="font-bold text-3xl tracking-tight md:text-4xl">
								{hypercertData.metadata.name}
							</h1>
							<ul className="flex flex-wrap items-center gap-1 space-x-3">
								{hypercertData.metadata.work_scope
									? hypercertData.metadata.work_scope.map((scope) => (
											<Badge key={scope}>{scope}</Badge>
									  ))
									: null}
								{/* <Badge className="pointer-events-none hover:bg-vd-beige-200">
							<DynamicCategoryIcon category={report.category} />
							<p>{report.category}</p>
						</Badge>
						<Badge className="pointer-events-none hover:bg-vd-beige-200">
							<MapPin color="#C14E41" strokeWidth={1} size={18} />
							<p>{report.state}</p>
						</Badge> */}
							</ul>
							<div className="-mx-4 -my-4 fixed bottom-[96px] w-full md:relative md:bottom-auto md:mx-0 md:my-0">
								{/* <FundingDataWrapper
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
						</FundingDataWrapper> */}
							</div>
						</section>
						<section className="flex flex-col gap-2 pt-8 md:flex-row md:gap-12">
							<section className="flex flex-col gap-2">
								<div>
									<h3 className="pb-3 font-bold text-2xl">Description</h3>
									<p className="text-wrap leading-relaxed">
										{hypercertData.metadata.description}
									</p>
								</div>
								{hypercertData.metadata.image && (
									<div className="relative h-[358px] w-full overflow-hidden rounded-2xl md:h-[420px]">
										<Image
											src={hypercertData.metadata.image}
											alt="Report illustration"
											className="-z-10 bg-center object-cover"
											fill
										/>
									</div>
								)}
							</section>
							{hypercertData.metadata && (
								<div>
									<Separator className="my-6 block bg-stone-300 md:my-0 md:hidden" />
									<ReportSidebar
										metadata={hypercertData.metadata as SidebarData}
										hypercert_id={slug}
									/>
								</div>
							)}
						</section>
					</>
				)}
				{/* {contributions && (
					<div>
						<Separator className="my-6 block bg-stone-300 md:hidden" />
						<ReportSupportFeed contributions={contributions} />
					</div> 
				)}
					*/}
			</div>
		</main>
	);
}
