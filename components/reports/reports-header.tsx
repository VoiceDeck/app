"use client";
import { useFilters } from "@/contexts/filter";
import {
	type createFilterOptions,
	sortingOptions,
} from "@/lib/search-filter-utils";
import type { ISortingOption, Report } from "@/types";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
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
	const searchBarInput = filters.find(([key]) => key === "q")?.[1] || "";

	const handleSearch = (searchText: string) => {
		const newFilter = filters.filter(([key]) => key !== "q");
		if (searchText) {
			newFilter.push(["q", searchText]);
		}
		updateSearchParams(newFilter);
	};

	const renderSearchInput = (placeholderText: string, inputClass: string) => (
		<Input
			value={searchBarInput}
			className={inputClass}
			placeholder={placeholderText}
			onChange={(e) => handleSearch(e.target.value)}
		/>
	);

	const renderSelectSort = (triggerClass: string) => (
		<Select name="sort" onValueChange={setActiveSort}>
			<SelectTrigger className={triggerClass}>
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
	);

	const MobileHeader = () => (
		<section className="flex flex-col gap-2 md:hidden w-full">
			<div className="relative flex-1">
				<span className="absolute top-1/2 left-2 transform -translate-y-1/2">
					<Search className="text-vd-blue-600" />
				</span>
				{renderSearchInput(
					"Search in title, summary",
					"pl-10 h-10 border-vd-blue-500 bg-vd-beige-100 py-2 text-[16px] font-medium placeholder:text-vd-blue-500/60 ring-offset-white focus-visible:ring-offset-2 focus-visible:ring-vd-blue-400 focus-visible:ring-2",
				)}
			</div>
			<div className="flex gap-2">
				<ReportsFilters
					isOpen={filterOverlayOpen}
					setIsOpen={setFilterOverlayOpen}
					filterOptions={filterOptions}
				/>
				{renderSelectSort("max-w-[300px] min-w-[170px]")}
				<Button
					className="text-xs"
					variant={"outline"}
					onClick={() => updateSearchParams([])}
				>
					Clear all filters
				</Button>
			</div>
		</section>
	);

	const DesktopHeader = () => (
		<section className="gap-2 hidden md:flex w-full">
			<ReportsFilters
				isOpen={filterOverlayOpen}
				setIsOpen={setFilterOverlayOpen}
				filterOptions={filterOptions}
			/>
			<div className="relative flex-1 max-w-xl">
				<span className="absolute top-1/2 left-2 transform -translate-y-1/2">
					<Search className="text-vd-blue-600" />
				</span>
				{renderSearchInput(
					"Search in title, summary",
					"pl-10 h-10 border-vd-blue-500 bg-vd-beige-100 py-2 text-[16px] font-medium placeholder:text-vd-blue-500/60 ring-offset-white focus-visible:ring-offset-2 focus-visible:ring-vd-blue-400 focus-visible:ring-2",
				)}
			</div>
			{renderSelectSort("max-w-[200px] min-w-[170px]")}
			<Button
				className="text-xs"
				variant={"outline"}
				onClick={() => updateSearchParams([])}
			>
				Clear all filters
			</Button>
		</section>
	);

	return (
		<article className="w-full">
			<h2 className="text-3xl md:text-4xl font-semibold pb-1">Reports</h2>
			<p className="text-sm md:text-lg">
				Find and fund reports that resonate with you.
			</p>
			<div className="flex gap-3 w-full py-4">
				<MobileHeader />
				<DesktopHeader />
			</div>
		</article>
	);
};

export default ReportsHeader;
