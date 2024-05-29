"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useFilters } from "@/contexts/filter";
import {
	type createFilterOptions,
	sortingOptions,
} from "@/lib/search-filter-utils";
import type { ISortingOption, Report } from "@/types";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReportsFilters from "./reports-filters";

interface ReportsHeaderProps {
	reports: Report[];
	filterOverlayOpen: boolean;
	setFilterOverlayOpen: React.Dispatch<React.SetStateAction<boolean>>;
	filterOptions: ReturnType<typeof createFilterOptions>;
	activeSort: ISortingOption["value"];
	setActiveSort: React.Dispatch<React.SetStateAction<ISortingOption["value"]>>;
}

const ReportsHeader: React.FC<ReportsHeaderProps> = ({
	filterOverlayOpen,
	setFilterOverlayOpen,
	filterOptions,
	activeSort,
	setActiveSort,
}) => {
	const { filters, updateSearchParams } = useFilters();
	const searchInputValue = filters.find(([key]) => key === "q")?.[1] || "";
	const [searchInput, setSearchInput] = useState(searchInputValue);

	useEffect(() => {
		setSearchInput(searchInputValue);
	}, [searchInputValue]);

	const executeSearch = useCallback(
		(query: string) => {
			const updatedFilters = filters.filter(([key]) => key !== "q");
			if (query) updatedFilters.push(["q", query]);
			updateSearchParams(updatedFilters);
		},
		[filters, updateSearchParams],
	);

	const SearchBar = useMemo(
		() => (
			<div className="relative flex-1 max-w-xl">
				<span className="absolute top-1/2 left-2 transform -translate-y-1/2">
					<Search className="text-vd-blue-600" />
				</span>

				<div className="flex w-full gap-1">
					<Input
						value={searchInput}
						className="pl-10 h-10 border-vd-blue-500 bg-vd-beige-100 py-2 text-sm md:text-base font-medium placeholder:text-vd-blue-500/60 ring-offset-white focus-visible:ring-offset-2 focus-visible:ring-vd-blue-400 focus-visible:ring-2"
						placeholder="Search in title, summary"
						onChange={(e) => setSearchInput(e.target.value)}
					/>
					<Button
						className="rounded-md"
						onClick={() => executeSearch(searchInput)}
					>
						Search
					</Button>
				</div>
			</div>
		),
		[searchInput, executeSearch],
	);

	const SortDropdown = useMemo(
		() => (
			<Select name="sort" onValueChange={setActiveSort}>
				<SelectTrigger className="max-w-[200px] min-w-[170px] md:max-w-[300px]">
					<SelectValue
						placeholder={
							activeSort ? sortingOptions[activeSort].label : "Sort by"
						}
					/>
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{Object.values(sortingOptions).map((option) => (
							<SelectItem
								key={option.value}
								value={option.value}
								defaultChecked={activeSort === option.value}
							>
								{option.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		),
		[activeSort, setActiveSort],
	);

	const MobileViewHeader = useMemo(
		() => (
			<section className="flex flex-col gap-2 md:hidden w-full">
				{SearchBar}

				<div className="flex gap-2">
					<ReportsFilters
						isOpen={filterOverlayOpen}
						setIsOpen={setFilterOverlayOpen}
						filterOptions={filterOptions}
					/>
					{SortDropdown}
					<Button
						className="text-xs"
						variant="outline"
						onClick={() => updateSearchParams([])}
					>
						Clear all
					</Button>
				</div>
			</section>
		),
		[
			filterOverlayOpen,
			setFilterOverlayOpen,
			filterOptions,
			SearchBar,
			SortDropdown,
			updateSearchParams,
		],
	);

	const DesktopViewHeader = useMemo(
		() => (
			<section className="gap-2 hidden md:flex justify-between w-full">
				<div className="flex w-full gap-3 min-[2560px]:gap-0">
					<ReportsFilters
						isOpen={filterOverlayOpen}
						setIsOpen={setFilterOverlayOpen}
						filterOptions={filterOptions}
					/>
					{SearchBar}
				</div>
				<div className="flex gap-3">
					{SortDropdown}
					<Button
						className="text-xs"
						variant="outline"
						onClick={() => updateSearchParams([])}
					>
						Clear all filters
					</Button>
				</div>
			</section>
		),
		[
			filterOverlayOpen,
			setFilterOverlayOpen,
			filterOptions,
			SearchBar,
			SortDropdown,
			updateSearchParams,
		],
	);

	return (
		<article className="w-full">
			<h2 className="text-2xl md:text-4xl font-semibold pb-1">Contributions</h2>
			<p className="text-sm md:text-lg">
				Find and fund your favorite contributions
			</p>
			<div className="flex gap-3 w-full py-4">
				{MobileViewHeader}
				{DesktopViewHeader}
			</div>
		</article>
	);
};

export default ReportsHeader;
