import ReportCard from "@/components/reports/report-card";
import { siteConfig } from "@/config/site";
import { getNumberOfContributors } from "@/lib/directus";
import { fetchReports } from "@/lib/impact-reports";
import type { Report } from "@/types";
import Link from "next/link";
// import { useMemo } from "react";

// export const meta: MetaFunction = () => {
// 	return [
// 		{ title: "VoiceDeck" },
// 		{ name: "description", content: "Welcome to VoiceDeck!" },
// 	];
// };

// interface IPageData {
// 	reports: Report[];
// 	numOfContributors: number;
// }

// export const loader: LoaderFunction = async ({ request }) => {
// 	try {
// 		const reports = await fetchReports();
// 		const numOfContributors = await getNumberOfContributors();

// 		return {
// 			reports,
// 			numOfContributors,
// 		};
// 	} catch (error) {
// 		console.error("Failed to load reports or number of contributors:", error);
// 		throw new Response("Failed to load data", { status: 500 });
// 	}
// };

// let cacheData: IPageData;

// export const clientLoader: ClientLoaderFunction = async ({ serverLoader }) => {
// 	if (cacheData) {
// 		return {
// 			reports: cacheData.reports,
// 			numOfContributors: cacheData.numOfContributors,
// 		};
// 	}

// 	const serverLoaderData = await serverLoader<IPageData>();
// 	const { reports, numOfContributors } = serverLoaderData;
// 	cacheData = {
// 		reports,
// 		numOfContributors,
// 	};
// 	return cacheData;
// };

// clientLoader.hydrate = true;

async function getData() {
	const reports = await fetchReports();

	const reportIds = new Set();
	// If it a report cmsId is not unique, it will be filtered out, this seems to always return the first report
	const uniqueReports = reports.filter((report) => {
		const isUnique = !reportIds.has(report.cmsId);
		reportIds.add(report.cmsId);
		return isUnique;
	});
	const numOfContributors = await getNumberOfContributors();

	return { reports: uniqueReports, numOfContributors };
}

export default async function ReportsPage() {
	const { reports, numOfContributors } = await getData();

	// This throws an error because we are violating the rules of hooks.

	// const contributionAmounts = useMemo(() => {
	// 	if (!reports) {
	// 		return {
	// 			amounts: [],
	// 			sum: 0,
	// 			numFunded: 0,
	// 		};
	// 	}
	// 	const allAmounts = reports.map(
	// 		(report: Report) => report.fundedSoFar || 0,
	// 	);
	// 	const sumOfAmounts = allAmounts.reduce((a: number, b: number) => a + b, 0);
	// 	const fullyFunded = allAmounts.filter((amount: number) => amount === 1000);
	// 	return {
	// 		amounts: allAmounts,
	// 		sum: sumOfAmounts,
	// 		numFunded: fullyFunded.length,
	// 	};
	// }, [reports]);

	return (
		<main className="flex flex-col gap-6 md:gap-4 justify-center items-center p-4 md:px-[14%]">
			<section className="flex-row bg-[url('/hero_imgLG.jpg')] bg-cover bg-center justify-start items-baseline text-vd-beige-200 rounded-3xl p-4 pt-24 md:pt-36 md:pr-48 md:pb-2 md:pl-8 max-w-screen-xl">
				<h1 className="text-3xl md:text-6xl font-bold text-left">
					{siteConfig.title}
				</h1>
				<h2 className="text-lg font-medium text-left py-6">
					{siteConfig.description}
				</h2>
			</section>
			{/* <VoicedeckStats
					numOfContributors={numOfContributors}
					sumOfContributions={contributionAmounts.sum}
					numOfContributions={contributionAmounts.numFunded}
				/>

				<ReportsHeader
					reports={reports}
					amounts={contributionAmounts.amounts}
				/> */}
			<section className="grid grid-rows-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 md:gap-3 max-w-screen-xl">
				{reports.map((report: Report) => (
					<Link
						href={`/reports/${report.slug}`}
						key={report.hypercertId}
						passHref
					>
						<ReportCard
							hypercertId={report.hypercertId}
							image={report.image}
							title={report.title}
							summary={report.summary}
							category={report.category}
							state={report.state}
							totalCost={report.totalCost}
							fundedSoFar={report.fundedSoFar}
						/>
					</Link>
				))}
			</section>
		</main>
	);
}
