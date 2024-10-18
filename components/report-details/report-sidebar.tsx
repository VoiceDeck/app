import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Report } from "@/types";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

const ImpactDetails = ({ report }: { report: Report }) => {
	const details = [
		{
			title: "Impact Scope",
			value: report.impactScope ?? "N/A",
		},
		{
			title: "Impact Timeframe",
			value: report.impactTimeframe
				? report.impactTimeframe
				: "N/A",
		},
		{
			title: "Work Timeframe",
			value: report.workTimeframe
				? report.workTimeframe
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
						"pl-0 text-vd-orange-800 hover:text-vd-orange-900 dark:text-vd-beige-100 dark:hover:text-vd-beige-100 gap-1 group",
					)}
				>
					<span>View Hypercert</span>
					<ArrowUpRight
						size={18}
						className="opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-transform duration-300 ease-in-out"
						aria-hidden="true"
					/>
				</a>
				<a
					href="https://voicedeck.org/faq#hypercert"
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						buttonVariants({ variant: "link" }),
						"pl-0 text-vd-orange-800 hover:text-vd-orange-900 dark:text-vd-beige-100 dark:hover:text-vd-beige-100 gap-1 group",
					)}
				>
					<span>What is a Hypercert?</span>
					<ArrowUpRight
						size={18}
						className="opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-transform duration-300 ease-in-out"
						aria-hidden="true"
					/>
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
						"pl-0 text-vd-orange-800 hover:text-vd-orange-900 dark:text-vd-beige-100 dark:hover:text-vd-beige-100 gap-1 group",
					)}
				>
					<span>View original report</span>
					<ArrowUpRight
						size={18}
						className="opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-transform duration-300 ease-in-out"
						aria-hidden="true"
					/>
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
						"pl-0 text-vd-orange-800 hover:text-vd-orange-900 dark:text-vd-beige-100 dark:hover:text-vd-beige-100 gap-1 group",
					)}
				>
					<p>Learn more</p>
					<ArrowUpRight
						size={18}
						className="opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-transform duration-300 ease-in-out"
						aria-hidden="true"
					/>
				</a>
			</CardContent>
		</Card>
	);
};
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
