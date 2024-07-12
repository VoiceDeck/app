"use client";
import ReportCard from "@/components/reports/report-card";
import ReportsHeader from "@/components/reports/reports-header";
import { useFilters } from "@/contexts/filter";
import { usePagination } from "@/hooks/use-pagination";

import { Button } from "@/components/ui/button";
import { SupportedChainIdType } from "@/lib/constants";
import {
	createFilterOptions,
	filterReports,
	sortingOptions,
} from "@/lib/search-filter-utils";
import type { Hypercert, HypercertData, ISortingOption, Report } from "@/types";
import Fuse from "fuse.js";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { ShowingDisplay, VDPaginator } from "../global/vd-paginator";
import { SidebarFilter } from "./filter-sidebar";

export function ReportsView({ hypercerts }: { hypercerts: Hypercert[] }) {
	const { filters, updateSearchParams } = useFilters();
	// ! Commented out while migrating to HypercertData
	// const [activeSortOption, setActiveSortOption] = useState(
	// 	sortingOptions.createdNewestFirst.value,
	// );
	let filteredReports = useMemo(() => hypercerts, [hypercerts]);
	const itemsPerPage = 10;

	const filterOptions = useMemo(() => {
		return createFilterOptions(hypercerts);
	}, [hypercerts]);

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
		() => new Fuse(hypercerts, fuseOptions),
		[hypercerts, fuseOptions],
	);
	if (filters.length > 0) {
		filteredReports = filterReports(hypercerts, filters, fuse);
	}

	const sortReports = useCallback(
		(reports: HypercertData[], sortOption: ISortingOption["value"]) => {
			const sortFn = sortingOptions[sortOption]?.sortFn;
			if (sortFn) {
				return [...reports].sort(sortFn);
			}
			return reports;
		},
		[],
	);

	// ! Commented out while migrating to HypercertData
	// filteredReports = useMemo(
	// 	() => sortReports(filteredReports, activeSortOption),
	// 	[filteredReports, activeSortOption, sortReports],
	// );

	const {
		currentPage,
		currentPageItems: pageTransactions,
		loadPage,
		maxPage,
		needsPagination,
	} = usePagination<Hypercert>(filteredReports, itemsPerPage);

	const [filterOpen, setFilterOpen] = useState(false);

	const clearFiltersAndSearch = useCallback(
		() => updateSearchParams([]),
		[updateSearchParams],
	);

	return (
		<section
			className="flex max-w-screen-xl border-t border-t-stone-300 min-[2560px]:mx-auto min-[2560px]:grid min-[2560px]:w-[64vw] min-[2560px]:grid-cols-[380px_1fr]"
			id="discover"
		>
			{/* <div className="hidden md:block">
				<SidebarFilter
					isOpen={filterOpen}
					setIsOpen={setFilterOpen}
					filterOptions={filterOptions}
				/>
			</div> */}
			<section className="container flex-1 px-3 py-6 md:px-8 md:py-8">
				{/* <ReportsHeader
					reports={reports}
					filterOverlayOpen={filterOpen}
					setFilterOverlayOpen={setFilterOpen}
					filterOptions={filterOptions}
					activeSort={activeSortOption}
					setActiveSort={setActiveSortOption}
				/> */}
				{filteredReports.length > 0 && (
					<ShowingDisplay
						currentPage={currentPage}
						totalItemAmount={filteredReports.length}
						itemsPerPage={itemsPerPage}
					/>
				)}
				<div className="p-3" />
				<div className="flex flex-wrap items-stretch justify-start gap-3 sm:gap-5">
					{hypercerts.length ? (
						hypercerts.map((hypercert: Hypercert) => (
							<ReportCard
								key={hypercert.hypercert_id}
								hypercert_id={hypercert.hypercert_id}
								image={hypercert.metadata.image}
								name={hypercert.metadata.name}
								chain_id={hypercert.contract.chain_id}
								totalUnitsForSale={hypercert.orders.totalUnitsForSale}
								lowestAvailablePrice={hypercert.orders.lowestAvailablePrice}
								units={hypercert.units}
							/>
						))
					) : (
						<section className="flex w-full items-center justify-center py-6">
							<div className="flex flex-col items-center pb-24 text-center md:pb-10">
								<div className="h-20 w-20">
									<Image
										src="/reports_not_found.svg"
										alt="flower illustration"
										height={20}
										width={20}
									/>
								</div>
								<p className="font-bold text-lg text-vd-beige-600">
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
				{needsPagination && (
					<section className="flex flex-col items-center justify-center gap-2">
						<VDPaginator
							needsPagination={needsPagination}
							currentPage={currentPage}
							maxPage={maxPage}
							loadPage={loadPage}
						/>
						<ShowingDisplay
							currentPage={currentPage}
							totalItemAmount={filteredReports.length}
							itemsPerPage={itemsPerPage}
						/>
					</section>
				)}
			</section>
		</section>
	);
}
