import { cn } from "@/lib/utils";
import type { Report } from "@/types";
import { ExternalLinkIcon, ShieldCheck } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const ImpactDetails = ({ report }: { report: Report }) => {
	const details = [
		{
			title: "Impact Scope",
			value: report.impactScope ?? "N/A",
		},
		{
			title: "Impact Timeframe",
			value: report.impactTimeframe
				? new Date(report.impactTimeframe).toLocaleDateString()
				: "N/A",
		},
		{
			title: "Work Timeframe",
			value: report.workTimeframe
				? new Date(report.workTimeframe).toLocaleDateString()
				: "N/A",
		},
		{
			title: "Contributors",
			value:
				report.contributors.length > 0
					? report.contributors.map((contributor) => contributor).join(", ")
					: "N/A",
		},
	];
	return (
		<Card className="bg-vd-beige-100 md:min-w-[300px] shadow-none">
			<CardHeader>
				<CardTitle className="text-xl font-semibold leading-none tracking-tight line-clamp-none">
					Impact Details
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ul>
					{details.map((detail, index) => (
						<li
							key={detail.title}
							className="border-b-[1.5px] border-b-vd-beige-200 py-4"
						>
							<p className="text-sm text-vd-blue-600">{detail.title}</p>
							<div className="p-1" />
							<p className="text-base">{detail.value}</p>
						</li>
					))}
				</ul>
				<a
					href={`https://testnet.hypercerts.org/app/view#claimId=${report.hypercertId}`}
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						buttonVariants({ variant: "link" }),
						"pl-0 text-vd-orange-800 hover:text-vd-orange-900 dark:text-vd-beige-100 dark:hover:text-vd-beige-100 gap-2",
					)}
				>
					<p>View Hypercert</p>
					<ExternalLinkIcon size={18} />
				</a>
				<a
					href="https://voicedeck.org/faq#hypercert"
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						buttonVariants({ variant: "link" }),
						"pl-0 text-vd-orange-800 hover:text-vd-orange-900 dark:text-vd-beige-100 dark:hover:text-vd-beige-100 gap-2",
					)}
				>
					<p>What is a Hypercert?</p>
					<ExternalLinkIcon size={18} />
				</a>
			</CardContent>
		</Card>
	);
};

const EvaluationDetails = ({ report }: { report: Partial<Report> }) => {
	const verifiedData = [
		{
			title: "Verified By",
			value: report.verifiedBy || "Not Verified",
		},
		{
			title: "Byline",
			value: report.byline || "Anonymous",
		},
	];

	return (
		<Card className="bg-vd-beige-100 md:min-w-[300px] shadow-none">
			<CardHeader>
				<CardTitle className="text-xl font-semibold leading-none tracking-tight line-clamp-none">
					Evaluation & Verification
				</CardTitle>
			</CardHeader>
			<CardContent>
				{report.verifiedBy && (
					<div className="p-3 bg-vd-blue-100 rounded-md">
						<ShieldCheck size={32} className="stroke-current" />
						<div className="p-1" />
						<p className="text-sm text-vd-blue-700 font-medium">
							We have confirmed that this report has generated a positive
							outcome in the region.
						</p>
					</div>
				)}
				<ul>
					{verifiedData.map((detail, index) => (
						<li
							key={detail.title}
							className="border-b-[1.5px] border-b-vd-beige-200 py-4"
						>
							<p className="text-sm text-vd-blue-600">{detail.title}</p>
							<div className="p-1" />
							<p className="text-base">{detail.value}</p>
						</li>
					))}
				</ul>
				<a
					href={report.originalReportUrl}
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						buttonVariants({ variant: "link" }),
						"pl-0 text-vd-orange-800 hover:text-vd-orange-900 dark:text-vd-beige-100 dark:hover:text-vd-beige-100 gap-2",
					)}
				>
					<p>View original report</p>
					<ExternalLinkIcon size={18} />
				</a>
			</CardContent>
		</Card>
	);
};

const BCRatio = ({ report }: { report: Partial<Report> }) => {
	const verifiedData = [
		{
			title: "Verified By",
			value: report.verifiedBy || "Not Verified",
		},
		{
			title: "Byline",
			value: report.byline || "Anonymous",
		},
	];

	return (
		<Card className="bg-vd-beige-300 md:min-w-[300px] shadow-none">
			<CardHeader>
				<CardTitle className="text-xl font-semibold leading-none tracking-tight line-clamp-none">
					Benefit cost ratio
				</CardTitle>
			</CardHeader>
			<CardContent>
				<h5 className="text-5xl font-bold tracking-tighter">
					{report.bcRatio || "N/A"}
				</h5>
				<a
					href="https://voicedeck.org/faq#bcratio"
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						buttonVariants({ variant: "link" }),
						"pl-0 text-vd-orange-800 hover:text-vd-orange-900 dark:text-vd-beige-100 dark:hover:text-vd-beige-100 gap-2",
					)}
				>
					<p>Learn more</p>
					<ExternalLinkIcon size={18} />
				</a>
			</CardContent>
		</Card>
	);
};
// TODO: @thebeyondr - Refactor cards to use the same skeleton
const ReportSidebar = ({ report }: { report: Report }) => {
	return (
		<aside className="flex flex-col gap-4">
			<BCRatio report={report} />
			<ImpactDetails report={report} />
			<EvaluationDetails report={report} />
		</aside>
	);
};

export default ReportSidebar;
