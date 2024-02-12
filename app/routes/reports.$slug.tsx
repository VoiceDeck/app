import { MetaArgs, MetaFunction } from "@remix-run/react";
import parse from "html-react-parser";
import { MapPin } from "lucide-react";
import DynamicCategoryIcon from "~/components/dynamic-category-icon";
import FundingProgress from "~/components/funding-progress";
import ReportSidebar from "~/components/report-sidebar";
import ReportSupportFeed from "~/components/report-support-feed";
import { Badge } from "~/components/ui/badge";
import { Report } from "~/types";

const report: Report = {
	hypercertId:
		"0xa16dfb32eb140a6f3f2ac68f41dad8c7e83c4941-40153319296670738688678203676948648951808",
	title: "Return of Teachers at Government School",
	summary:
		"The return of teachers to the classrooms of Sarvodaya Kanya Vidyalaya following an intervention initiated by a student and facilitated by Shramik Vani has had profound implications on the future prospects of the students. This intervention has directly impacted the educational environment by addressing the absence of teachers in Class VIII.",
	image:
		"https://directus.vd-dev.org/assets/1c2f94ec-69a2-4315-9ba9-ead912f6d9ae",
	originalReportUrl:
		"http://voice.gramvaani.org/vapp/mnews/1129/show/detail/3433262/",
	state: "DL",
	category: "Opportunity",
	contributors: ["Mobile Vaani", "Reena Parveen"],
	cmsId: "04c188e7-ebdf-4321-babf-24a792f8532c",
	status: "published",
	dateCreated: "2024-01-31T23:55:45.417Z",
	slug: "return-teachers-government-school",
	story:
		'<p dir="ltr">Considering the lifetime benefits associated with just one additional high school graduate, the intervention exhibits a benefit-to-cost ratio of 15, indicating significant long-term returns on the investment in educational consistency and quality.</p>\n<p><strong>&nbsp;</strong></p>\n<p dir="ltr">Assumptions:</p>\n<ul>\n<li dir="ltr" aria-level="1">\n<p dir="ltr" role="presentation">The intervention, including the dissemination of information and coordination with authorities, cost $1000.</p>\n</li>\n<li dir="ltr" aria-level="1">\n<p dir="ltr" role="presentation">The projection of economic benefit is based on one extra student graduating high school due to the improved teaching presence.</p>\n</li>\n<li dir="ltr" aria-level="1">\n<p dir="ltr" role="presentation">An additional high school graduate is expected to earn $10,000 more during their lifetime, and receive $5,000 worth of health benefits.</p>\n</li>\n<li dir="ltr" aria-level="1">\n<p dir="ltr" role="presentation">The numbers are adjusted to reflect Purchasing Power Parity (PPP) between the United States and India.</p>\n</li>\n</ul>\n<p><strong>&nbsp;</strong></p>\n<h2 dir="ltr">Benefits:</h2>\n<p dir="ltr">The benefits of reinstating teachers in the classrooms are multifaceted:</p>\n<ol>\n<li dir="ltr" aria-level="1">\n<p dir="ltr" role="presentation">Academic continuity and quality are restored, which is essential for student progress.</p>\n</li>\n<li dir="ltr" aria-level="1">\n<p dir="ltr" role="presentation">It is projected that the intervention will result in at least one extra student graduating, accruing lifetime economic benefits and better health outcomes.</p>\n</li>\n</ol>\n<p><strong>&nbsp;</strong></p>\n<p dir="ltr">Quantifying the economic benefit for the single additional graduate:</p>\n<ul>\n<li dir="ltr" aria-level="1">\n<p dir="ltr" role="presentation">Lifetime employment benefit: $10,000</p>\n</li>\n<li dir="ltr" aria-level="1">\n<p dir="ltr" role="presentation">Health benefit: $5,000</p>\n</li>\n<li dir="ltr" aria-level="1">\n<p dir="ltr" role="presentation">Total benefit for one graduate: $10,000 + $5,000 = $15,000</p>\n</li>\n</ul>\n<p><strong>&nbsp;</strong></p>\n<p dir="ltr">Consequently, we can calculate the benefit-to-cost ratio as follows:</p>\n<ul>\n<li dir="ltr" aria-level="1">\n<p dir="ltr" role="presentation">Benefit/Cost Ratio: $15,000 (total benefits for one graduate) / $1,000 (intervention cost) = 15</p>\n</li>\n</ul>\n<p><strong>&nbsp;</strong></p>\n<h2 dir="ltr">Counterfactual:</h2>\n<p dir="ltr">In the absence of the intervention, one can assume the continuity issue would persist, potentially leading to a drop in academic performance and a decrease in the overall graduation rate. This drop could mean the loss of the quantified benefits associated with a high school degree, both in employment earnings and health benefits. We assume one extra student graduated high school due to the intervention.</p>\n<p><strong>&nbsp;</strong></p>\n<h2 dir="ltr">Conclusion:</h2>\n<p dir="ltr">The calculated benefit-to-cost ratio of 15 reveals that each dollar spent on the intervention to return teachers to the classroom could yield a $15 benefit for each additional high school graduate. This interventional impact not only transcends its initial cost but also suggests an incremental impact on lifetime productivity and health. It underscores the profound importance of teaching consistency on student outcomes and endorses further investment in educational infrastructure and monitoring to secure the presence of teachers and the quality of education in schools.</p>',
	bcRatio: 15,
	villagesImpacted: null,
	peopleImpacted: null,
	verifiedBy: ["MV"],
	dateUpdated: null,
	byline: "Devansh",
	totalCost: 1000,
	fundedSoFar: 12,
	impactScope:
		"The return of teachers to the classrooms of Sarvodaya Kanya Vidyalaya",
	impactTimeframe: "2024-01-31T23:55:45.417Z",
	workTimeframe: "2024-01-31T23:55:45.417Z",
};

export const meta: MetaFunction = ({ data }: MetaArgs) => {
	const report = data as Report;
	// TODO: Add the report title
	// return [{ title: `VoiceDeck | ${report.title}` }];
	return [{ title: "VoiceDeck | Test Report" }];
};

const htmlParsedStory = report?.story ? parse(report.story) : "";

export default function RouteComponent() {
	return (
		<main className="flex flex-col border-2 border-red-100 justify-between h-svh">
			{/* 140px is added to account for the funding progress on mobile */}
			<div className="flex flex-col gap-2 space-y-2 p-4 pb-[180px]">
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
			</div>
			<ReportSupportFeed report={report} />
			<div className="fixed bottom-[56px] w-full shadow-lg">
				<FundingProgress totalAmount={100} fundedAmount={27} />
			</div>
		</main>
	);
}
