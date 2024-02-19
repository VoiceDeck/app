import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, Outlet, json, useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import ReportCard from "~/components/reports/report-card";
import ReportsHeader from "~/components/reports/reports-header";
import VoicedeckStats from "~/components/reports/voicedeck-stats";
import { siteConfig } from "~/config/site";
import { Report } from "~/types";
import { fetchReports } from "../impact-reports.server";

export const meta: MetaFunction = () => {
	return [
		{ title: "VoiceDeck" },
		{ name: "description", content: "Welcome to VoiceDeck!" },
	];
};

export const loader: LoaderFunction = async () => {
	try {
		const response = await fetchReports();

		return json(response);
	} catch (error) {
		console.error(`Failed to load impact reports: ${error}`);
		throw new Response("Failed to load impact reports", { status: 500 });
	}
};

export default function Reports() {
	const reports = useLoaderData<typeof loader>();

	const contributionAmounts = useMemo(() => {
		const allAmounts = reports.map(
			(report: Report, index: number) => report.fundedSoFar || 0,
		);
		const sumOfAmounts = allAmounts.reduce((a: number, b: number) => a + b, 0);
		const fullyFunded = allAmounts.filter((amount: number) => amount === 1000);
		return {
			amounts: allAmounts,
			sum: sumOfAmounts,
			numFunded: fullyFunded.length || 0,
		};
	}, [reports]);

	return (
		<main className="flex flex-col gap-6 md:gap-4 justify-center items-center p-4 md:px-[14%]">
			<header className="flex-row bg-[url('/hero_imgLG.jpg')] bg-cover bg-center justify-start items-baseline text-vd-beige-200 rounded-3xl p-4 pt-24 md:pt-36 md:pr-48 md:pb-2 md:pl-8 max-w-screen-xl">
				<h1 className="text-6xl font-bold text-left">{siteConfig.title}</h1>
				<h2 className="text-lg font-medium text-left py-6">
					{siteConfig.description}
				</h2>
			</header>

			<VoicedeckStats
				sumOfContributions={contributionAmounts.sum}
				numOfContributions={contributionAmounts.numFunded}
			/>

			<ReportsHeader reports={reports} amounts={contributionAmounts.amounts} />

			<section className="grid grid-rows-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 md:gap-3">
				{reports.map((report: Report) => (
					<Link to={`/reports/${report.slug}`} key={report.hypercertId}>
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
