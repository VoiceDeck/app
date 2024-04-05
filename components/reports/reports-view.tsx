"use client";
import ReportCard from "@/components/reports/report-card";
import ReportsHeader from "@/components/reports/reports-header";
import { useFilters } from "@/contexts/filter";
import { usePagination } from "@/hooks/use-pagination";

import { Button } from "@/components/ui/button";
import {
	createFilterOptions,
	filterReports,
	sortingOptions,
} from "@/lib/search-filter-utils";
import type { ISortingOption, Report } from "@/types";
import Fuse from "fuse.js";
import { useCallback, useMemo, useState } from "react";
import { ShowingDisplay, VDPaginator } from "../global/vd-paginator";
import { SidebarFilter } from "./filter-sidebar";

interface IPageData {
	reports: Report[];
}

export function ReportsView({ reports }: IPageData) {
	const { filters, updateSearchParams } = useFilters();
	const [activeSortOption, setActiveSortOption] = useState(
		sortingOptions.createdNewestFirst.value,
	);
	let filteredReports = useMemo(() => reports, [reports]);
	const itemsPerPage = 10;

	const filterOptions = useMemo(() => {
		return createFilterOptions(reports);
	}, [reports]);

	const fuseOptions = useMemo(
		() => ({
			minMatchCharLength: 3,
			threshold: 0.5,
			ignoreDistance: true,
			findAllMatches: true,
			keys: ["title", "summary"],
		}),
		[],
	);

	const fuse = useMemo(
		() => new Fuse(reports, fuseOptions),
		[reports, fuseOptions],
	);
	if (filters.length > 0) {
		filteredReports = filterReports(reports, filters, fuse);
	}

	const sortReports = useCallback(
		(reports: Report[], sortOption: ISortingOption["value"]) => {
			const sortFn = sortingOptions[sortOption]?.sortFn;
			if (sortFn) {
				return [...reports].sort(sortFn);
			}
			return reports;
		},
		[],
	);

	filteredReports = useMemo(
		() => sortReports(filteredReports, activeSortOption),
		[filteredReports, activeSortOption, sortReports],
	);

	const {
		currentPage,
		currentPageItems: pageTransactions,
		loadPage,
		maxPage,
		pageNumbers,
		needsPagination,
	} = usePagination<Report>(filteredReports, itemsPerPage);

	const [filterOpen, setFilterOpen] = useState(false);

	const clearFiltersAndSearch = useCallback(
		() => updateSearchParams([]),
		[updateSearchParams],
	);

	return (
		<section
			className="flex border-t border-t-stone-300 min-[2560px]:w-[64vw] min-[2560px]:grid min-[2560px]:mx-auto min-[2560px]:grid-cols-[380px_1fr]"
			id="discover"
		>
			<div className="hidden md:block">
				<SidebarFilter
					isOpen={filterOpen}
					setIsOpen={setFilterOpen}
					filterOptions={filterOptions}
				/>
			</div>
			<section className={"flex-1 py-6 md:py-8 px-3 md:px-8"}>
				<ReportsHeader
					reports={reports}
					filterOverlayOpen={filterOpen}
					setFilterOverlayOpen={setFilterOpen}
					filterOptions={filterOptions}
					activeSort={activeSortOption}
					setActiveSort={setActiveSortOption}
				/>
				{filteredReports.length > 0 && (
					<ShowingDisplay
						currentPage={currentPage}
						totalItemAmount={filteredReports.length}
						itemsPerPage={itemsPerPage}
					/>
				)}
				<div className="p-3" />
				<div className="flex gap-3 sm:gap-5 flex-wrap justify-center md:justify-start">
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
						<section className="w-full flex justify-center items-center py-6">
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
								<Button className="mt-4" onClick={clearFiltersAndSearch}>
									Clear filters and search
								</Button>
							</div>
						</section>
					)}
				</div>
				<section className="flex flex-col justify-center items-center gap-2">
					<VDPaginator
						needsPagination={needsPagination}
						currentPage={currentPage}
						maxPage={maxPage}
						loadPage={loadPage}
						pageNumbers={pageNumbers}
					/>
					<ShowingDisplay
						currentPage={currentPage}
						totalItemAmount={filteredReports.length}
						itemsPerPage={itemsPerPage}
					/>
				</section>
			</section>
		</section>
	);
}
