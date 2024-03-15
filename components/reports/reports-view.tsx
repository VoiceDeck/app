"use client";
import ReportCard from "@/components/reports/report-card";
import ReportsHeader from "@/components/reports/reports-header";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { useFilters } from "@/contexts/filter";
import { usePagination } from "@/hooks/use-pagination";

import { createFilterOptions, filterReports } from "@/lib/search-filter-utils";
import type { Report } from "@/types";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { SidebarFilter } from "./filter-sidebar";

interface IPageData {
	reports: Report[];
}

export function ReportsView({ reports }: IPageData) {
	const { filters, updateSearchParams } = useFilters();
	let filteredReports = reports;

	const filterOptions = useMemo(() => {
		return createFilterOptions(reports);
	}, [reports]);

	const fuseOptions = {
		minMatchCharLength: 3,
		threshold: 0.5,
		ignoreDistance: true,
		findAllMatches: true,
		keys: ["title", "summary"],
	};

	const fuse = new Fuse(reports, fuseOptions);
	if (filters.length > 0) {
		filteredReports = filterReports(reports, filters, fuse);
	}

	const {
		currentPage,
		currentPageItems: pageTransactions,
		loadPage,
		maxPage,
		pageNumbers,
		needsPagination,
		// TODO: Reset reports per page to 10
	} = usePagination<Report>(filteredReports, 5);

	const [filterOpen, setFilterOpen] = useState(false);

	return (
		<section className="flex border-t border-t-stone-300">
			<SidebarFilter
				isOpen={filterOpen}
				setIsOpen={setFilterOpen}
				filterOptions={filterOptions}
			/>
			<section className={"flex-1 py-6 px-3 md:px-8"}>
				<section className="flex flex-col px-3">
					<ReportsHeader
						reports={reports}
						filterOverlayOpen={filterOpen}
						setFilterOverlayOpen={setFilterOpen}
						filterOptions={filterOptions}
					/>
					<div className="flex gap-5 flex-wrap justify-center md:justify-start">
						{pageTransactions.length ? (
							pageTransactions.map((report: Report) => (
								<ReportCard
									key={report.hypercertId}
									slug={report.slug}
									hypercertId={report.hypercertId}
									image={report.image}
									title={report.title}
									summary={report.summary}
									category={report.category}
									state={report.state}
									totalCost={report.totalCost}
									fundedSoFar={report.fundedSoFar}
								/>
							))
						) : (
							<section className="w-full flex py-6">
								<div className="flex flex-col items-center text-center pb-24 md:pb-10">
									<img
										className="h-20 w-20"
										src="/reports_not_found.svg"
										alt="flower illustration"
									/>
									<p className="text-lg font-bold text-vd-beige-600">
										We couldn't find any reports matching your search or filter.
									</p>
									<p className="text-vd-beige-600">
										Please remove some of your filters and try again.
									</p>
									<Button
										className="mt-4"
										onClick={() => updateSearchParams([])}
									>
										Clear filters and search
									</Button>
								</div>
							</section>
						)}
					</div>

					{needsPagination && (
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
					)}
				</section>
			</section>
		</section>
	);
}
