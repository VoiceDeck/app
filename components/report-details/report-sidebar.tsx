import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Report } from "@/types";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

const ImpactDetails = ({ report }: { report: Report }) => {
	const details = [
		{
			title: "Work scope",
			value: report.impactScope ?? "N/A",
		},
		// {
		// 	title: "Impact Timeframe",
		// 	value: report.impactTimeframe
		// 		? new Date(report.impactTimeframe).toLocaleDateString()
		// 		: "N/A",
		// },
		{
			title: "Time of work",
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
					Hypercert details
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
					href="https://testnet.hypercerts.org/docs/intro"
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
			value: "Edge City core team",
			// value: report.verifiedBy || "Not Verified",
		},
	];

	return (
		<Card className="bg-vd-beige-100 md:min-w-[300px] shadow-none">
			<CardHeader>
				<CardTitle className="text-xl font-semibold leading-none tracking-tight line-clamp-none">
					Verification
				</CardTitle>
			</CardHeader>
			<CardContent>
				{report.verifiedBy && (
					<div className="p-3 bg-vd-blue-100 rounded-md">
						<ShieldCheck size={32} className="stroke-current" />
						<div className="p-1" />
						<p className="text-sm text-vd-blue-700 font-medium">
							The work and Hypercert details are verified.
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
			</CardContent>
		</Card>
	);
};

const ReportSidebar = ({ report }: { report: Report }) => {
	return (
		<aside className="flex flex-col gap-4">
			<ImpactDetails report={report} />
			<EvaluationDetails report={report} />
		</aside>
	);
};

export default ReportSidebar;
