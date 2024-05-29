import type { Report } from "@/types";
import { useMemo } from "react";

interface StatContainerProps {
	icon: string;
	heading: string;
	data: number;
	currency?: string;
}

const StatContainer: React.FC<StatContainerProps> = ({
	icon,
	heading,
	data,
	currency,
}) => {
	return (
		<div className="flex flex-auto items-center gap-5 lg:w-[33%] rounded-3xl bg-vd-blue-200 py-4 pl-5 pr-2">
			<img
				className="h-16 w-16"
				src={`/${icon}.svg`}
				alt={`${icon} illustration`}
			/>
			<div className="flex flex-col gap-1">
				<p className="text-base font-medium">{heading}</p>
				<p className="text-3xl md:text-3xl font-bold">
					{data}
					<span className="text-lg pl-1">{currency}</span>
				</p>
			</div>
		</div>
	);
};

interface VoicedeckStatsProps {
	numOfContributors: number;
	reports: Report[];
}

const VoicedeckStats: React.FC<VoicedeckStatsProps> = ({
	numOfContributors,
	reports,
}) => {
	const contributionAmounts = useMemo(() => {
		const totalContributions = reports.reduce(
			(total: number, report: Report) => total + (report.fundedSoFar || 0),
			0,
		);
		const reportsFullyFunded = reports.reduce(
			(acc: Report[], report: Report) => {
				if (report.fundedSoFar === report.totalCost) {
					acc.push(report);
				}
				return acc;
			},
			[] as Report[],
		);
		return {
			totalContributions,
			fundedReports: reportsFullyFunded.length || 0,
		};
	}, [reports]);

	const { totalContributions, fundedReports } = contributionAmounts;

	return (
		<section className="flex flex-col lg:flex-row w-full gap-3 max-w-screen-xl">
			<StatContainer
				key="flower"
				icon="flower"
				heading="Total supporters"
				data={numOfContributors}
			/>
			<StatContainer
				key="elephant"
				icon="elephant"
				heading="Total support received"
				data={totalContributions}
				currency="USD"
			/>
			<StatContainer
				key="candle"
				icon="candle"
				heading="# of contributions fully funded"
				data={fundedReports}
			/>
		</section>
	);
};

export default VoicedeckStats;
