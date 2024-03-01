import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
	ClientLoaderFunction,
	Link,
	useLoaderData,
	useSearchParams,
} from "@remix-run/react";
import Fuse from "fuse.js";
import { useMemo } from "react";
import ReportCard from "~/components/reports/report-card";
import ReportsHeader from "~/components/reports/reports-header";
import VoicedeckStats from "~/components/reports/voicedeck-stats";
import { siteConfig } from "~/config/site";
import { getNumberOfContributors } from "~/directus.server";
import { Report } from "~/types";
import { fetchReports } from "../impact-reports.server";

export const meta: MetaFunction = () => {
	return [
		{ title: "VoiceDeck" },
		{ name: "description", content: "Welcome to VoiceDeck!" },
	];
};

interface IPageData {
	reports: Report[];
	numOfContributors: number;
}

export const loader: LoaderFunction = async () => {
	try {
		const reports = await fetchReports();
		const reportIds = new Set();
		// If it a report cmsId is not unique, it will be filtered out, this seems to always return the first report
		const uniqueReports = reports.filter((report) => {
			const isUnique = !reportIds.has(report.cmsId);
			reportIds.add(report.cmsId);
			return isUnique;
		});
		const numOfContributors = await getNumberOfContributors();

		return {
			reports: uniqueReports,
			numOfContributors,
		};
	} catch (error) {
		console.error("Failed to load reports or number of contributors:", error);
		throw new Response("Failed to load data", { status: 500 });
	}
};

let cacheData: IPageData;

export const clientLoader: ClientLoaderFunction = async ({ serverLoader }) => {
	if (cacheData) {
		return {
			reports: cacheData.reports,
			numOfContributors: cacheData.numOfContributors,
		};
	}

	const serverLoaderData = await serverLoader<IPageData>();
	const { reports, numOfContributors } = serverLoaderData;
	cacheData = {
		reports,
		numOfContributors,
	};
	return cacheData;
};

clientLoader.hydrate = true;

export default function Reports() {
	const { reports, numOfContributors } = useLoaderData<typeof loader>();
	const [searchParams, setSearchParams] = useSearchParams();

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

	const getSelectedReports = useMemo(() => {
		const category = searchParams.get("category");
		const searchInput = searchParams.get("search-input");
		const minAmount = Number(searchParams.get("min"));
		const maxAmount = Number(searchParams.get("max"));
		const states = searchParams.getAll("state");
		const outlets = searchParams.getAll("outlet");
		const sortBy = searchParams.get("sort");
		let selectedReports = reports;
		if (category) {
			selectedReports = selectedReports.filter(
				(report: Report) => report.category === category,
			);
		}
		if (searchInput) {
			const fuseOptions = {
				// minMatchCharLength: 3,
				// threshold: 0.9,
				// distance: 10000,
				ignoreDistance: true,
				findAllMatches: true,
				// Search in titles and summaries of reports
				keys: ["title, summary"],
			};
			const fuse = new Fuse(selectedReports, fuseOptions);
			const searchResults = fuse.search(searchInput);
			selectedReports = searchResults.map((result) => result.item);
			console.log(selectedReports);
		}
		if (searchParams.has("min")) {
			selectedReports = selectedReports.filter(
				(report: Report) =>
					maxAmount >= report.totalCost - report.fundedSoFar &&
					minAmount <= report.totalCost - report.fundedSoFar,
			);
		}
		if (states.length) {
			console.log(states);
			selectedReports = selectedReports.filter((report: Report) =>
				states.includes(report.state),
			);
		}
		if (outlets.length) {
			console.log(outlets);
			selectedReports = selectedReports.filter((report: Report) =>
				outlets.includes(report.contributors[0]),
			);
		}
		if (sortBy) {
			if (sortBy === "$ to $$$ needed") {
				selectedReports = selectedReports.sort(
					(a: Report, b: Report) => b.fundedSoFar - a.fundedSoFar,
				);
			}
			if (sortBy === "$$$ to $ needed") {
				selectedReports = selectedReports.sort(
					(a: Report, b: Report) => a.fundedSoFar - b.fundedSoFar,
				);
			}
			if (sortBy === "Newest to oldest") {
				selectedReports = selectedReports.sort(
					(a: Report, b: Report) =>
						Date.parse(b.dateCreated || "") - Date.parse(a.dateCreated || ""),
				);
			}
			if (sortBy === "Oldest to newest") {
				selectedReports = selectedReports.sort(
					(a: Report, b: Report) =>
						Date.parse(a.dateCreated || "") - Date.parse(b.dateCreated || ""),
				);
			}
		}
		return selectedReports;
	}, [reports, searchParams]);

	return (
		<main className="flex flex-col gap-6 md:gap-4 justify-center items-center p-2 pt-4 md:px-[14%]">
			<header className="flex-row bg-[url('/hero_imgLG.jpg')] bg-cover bg-center justify-start items-baseline text-vd-beige-200 rounded-3xl p-4 pt-24 md:pt-36 md:pr-48 md:pb-2 md:pl-8 max-w-screen-xl">
				<h1 className="text-3xl md:text-6xl font-bold text-left">
					{siteConfig.title}
				</h1>
				<h2 className="text-lg font-medium text-left py-6">
					{siteConfig.description}
				</h2>
			</header>

			<VoicedeckStats
				numOfContributors={numOfContributors}
				sumOfContributions={contributionAmounts.sum}
				numOfContributions={contributionAmounts.numFunded}
			/>

			<ReportsHeader reports={reports} amounts={contributionAmounts.amounts} />

			<section className="grid grid-rows-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 md:gap-3 max-w-screen-xl pb-16 md:pb-8">
				{getSelectedReports.length
					? getSelectedReports.map((report: Report) => (
							<Link
								to={`/reports/${report.slug}`}
								key={report.hypercertId}
								prefetch="intent"
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
					  ))
					: null}
			</section>
			<section>
				{!getSelectedReports.length ? (
					<div className="flex flex-col items-center text-center pb-24 md:pb-10">
						<img
							className="h-20 w-20"
							src="/reports_not_found.svg"
							alt="flower illustration"
						/>
						<p className="text-vd-beige-600">
							No reports matched your request.
						</p>
						<p className="text-vd-beige-600">
							Please remove some of your filters and try again.
						</p>
					</div>
				) : null}
			</section>
		</main>
	);
}
