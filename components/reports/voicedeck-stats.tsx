import { Report } from "@/types";
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
      const allAmounts = reports.map(
        (report: Report, index: number) => report.fundedSoFar || 0,
      );
      const sumOfAmounts = allAmounts.reduce((a: number, b: number) => a + b, 0);
      const fullyFunded = allAmounts.filter((amount: number) => amount === 1000);
      return {
        amounts: allAmounts,
        sumOfContributions: sumOfAmounts,
        numOfContributions: fullyFunded.length || 0,
      };
    }, [reports]);

	const { sumOfContributions, numOfContributions } = contributionAmounts;

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
				data={sumOfContributions}
				currency="USD"
			/>
			<StatContainer
				key="candle"
				icon="candle"
				heading="# of reports fully funded"
				data={numOfContributions}
			/>
		</section>
	);
};

export default VoicedeckStats;
