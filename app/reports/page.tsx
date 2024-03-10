import ReportCard from "@/components/reports/report-card";
import ReportsHeader from "@/components/reports/reports-header";
import VoicedeckStats from "@/components/reports/voicedeck-stats";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { siteConfig } from "@/config/site";
import { usePagination } from "@/hooks/use-pagination";
import { getNumberOfContributors } from "@/lib/directus";
import { fetchReports } from "@/lib/impact-reports";
import type { Report } from "@/types";
import Fuse from "fuse.js";
import Link from "next/link";
import { useMemo, useState } from "react";

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
	const numOfContributors = await getNumberOfContributors();

	return { reports, numOfContributors };
}

export default async function ReportsPage() {
	const { reports, numOfContributors } = await getData();
	const uniqueReports = new Set(reports);
	// const [searchParams, setSearchParams] = useState(new URLSearchParams());
	// const searchParams = new URLSearchParams()

	// const contributionAmounts = useMemo(() => {
	// 	const allAmounts = reports.map(
	// 		(report: Report, index: number) => report.fundedSoFar || 0,
	// 	);
	// 	const sumOfAmounts = allAmounts.reduce((a: number, b: number) => a + b, 0);
	// 	const fullyFunded = allAmounts.filter((amount: number) => amount === 1000);
	// 	return {
	// 		amounts: allAmounts,
	// 		sum: sumOfAmounts,
	// 		numFunded: fullyFunded.length || 0,
	// 	};
	// }, [reports]);

	const contributionAmounts = () => {
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
	};

	// const getSelectedReports = useMemo(() => {
	// 	const category = searchParams.get("category");
	// 	const searchInput = searchParams.get("search-input");
	// 	const minAmount = Number(searchParams.get("min"));
	// 	const maxAmount = Number(searchParams.get("max"));
	// 	const states = searchParams.getAll("state");
	// 	const outlets = searchParams.getAll("outlet");
	// 	const sortBy = searchParams.get("sort");
	// 	let selectedReports = reports;
	// 	if (category) {
	// 		selectedReports = selectedReports.filter(
	// 			(report: Report) => report.category === category,
	// 		);
	// 	}
	// 	if (searchInput) {
	// 		const fuseOptions = {
	// 			minMatchCharLength: 3,
	// 			threshold: 0.5,
	// 			ignoreDistance: true,
	// 			findAllMatches: true,
	// 			keys: ["title", "summary"],
	// 		};
	// 		const fuse = new Fuse(selectedReports, fuseOptions);
	// 		const searchResults = fuse.search(searchInput);
	// 		selectedReports = searchResults.map((result) => result.item);
	// 	}
	// 	if (searchParams.has("min")) {
	// 		selectedReports = selectedReports.filter(
	// 			(report: Report) =>
	// 				maxAmount >= report.totalCost - report.fundedSoFar &&
	// 				minAmount <= report.totalCost - report.fundedSoFar,
	// 		);
	// 	}
	// 	if (states.length) {
	// 		selectedReports = selectedReports.filter((report: Report) =>
	// 			states.includes(report.state),
	// 		);
	// 	}
	// 	if (outlets.length) {
	// 		selectedReports = selectedReports.filter((report: Report) =>
	// 			outlets.includes(report.contributors[0]),
	// 		);
	// 	}
	// 	if (sortBy) {
	// 		if (sortBy === "$ to $$$ needed") {
	// 			selectedReports = selectedReports.sort(
	// 				(a: Report, b: Report) => b.fundedSoFar - a.fundedSoFar,
	// 			);
	// 		}
	// 		if (sortBy === "$$$ to $ needed") {
	// 			selectedReports = selectedReports.sort(
	// 				(a: Report, b: Report) => a.fundedSoFar - b.fundedSoFar,
	// 			);
	// 		}
	// 		if (sortBy === "Newest to oldest") {
	// 			selectedReports = selectedReports.sort(
	// 				(a: Report, b: Report) =>
	// 					Date.parse(b.dateCreated || "") - Date.parse(a.dateCreated || ""),
	// 			);
	// 		}
	// 		if (sortBy === "Oldest to newest") {
	// 			selectedReports = selectedReports.sort(
	// 				(a: Report, b: Report) =>
	// 					Date.parse(a.dateCreated || "") - Date.parse(b.dateCreated || ""),
	// 			);
	// 		}
	// 	}

	// 	return selectedReports;
	// }, [reports, searchParams]);

	// const {
	// 	currentPage,
	// 	currentPageItems: pageTransactions,
	// 	loadPage,
	// 	maxPage,
	// 	pageNumbers,
	// 	needsPagination,
	// 	// set to 3 reports per page for testing because currently only 8 reports exist
	// } = usePagination<Report>(reports, 3);

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
				sumOfContributions={contributionAmounts().sum}
				numOfContributions={contributionAmounts().numFunded}
			/>

			{/* <ReportsHeader
				searchParams={searchParams}
				setSearchParams={setSearchParams}
				reports={reports}
				amounts={contributionAmounts().amounts}
			/> */}

			<section className="px-2 pb-16 md:pb-8">
				<div className="grid grid-rows-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 md:gap-3 max-w-screen-xl">
					{reports.length
						? reports.map((report: Report) => (
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
						  ))
						: null}
				</div>

				{/* {needsPagination && (
					<Pagination className="pt-6">
						<PaginationContent>
							<PaginationItem className="hover:cursor-pointer">
								<PaginationPrevious
									onClick={() =>
										currentPage > 1 ? loadPage(currentPage - 1) : null
									}
								/>
							</PaginationItem>
							{pageNumbers
								.filter((pageNum) =>
									[currentPage - 1, currentPage, currentPage + 1].includes(
										pageNum,
									),
								)
								.map((pageNum, index) => (
									<PaginationItem
										onClick={() => loadPage(pageNum)}
										className="hover:cursor-pointer"
										key={`page-${pageNum}`}
									>
										<PaginationLink isActive={currentPage === pageNum}>
											{pageNum}
										</PaginationLink>
									</PaginationItem>
								))}
							{maxPage > 3 && (
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
							)}
							<PaginationItem className="hover:cursor-pointer">
								<PaginationNext
									onClick={() =>
										currentPage < maxPage ? loadPage(currentPage + 1) : null
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				)} */}
			</section>

			{!reports.length ? (
				<section>
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
				</section>
			) : null}
		</main>
	);
}
