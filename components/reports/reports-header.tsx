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
// TODO: Add sorting options
// const sortingOptions = [
// 	"$ to $$$ needed",
// 	"$$$ to $ needed",
// 	"Newest to oldest",
// 	"Oldest to newest",
// ];

const ReportsHeader: React.FC<ReportsHeaderProps> = ({
	filterOverlayOpen,
	setFilterOverlayOpen,
	filterOptions: {
		uniqueCategories,
		uniqueOutlets,
		uniqueStates,
		maxAmountNeeded,
		minAmountNeeded,
	},
	activeSort,
	setActiveSort,
}) => {
	const { filters, updateSearchParams } = useFilters();
	const searchBarInput = filters.find(([key, _]) => key === "q")?.[1] || "";

	const handleSearch = (searchText: string) => {
		const newFilter = filters.filter(([key, _]) => key !== "q");
		if (searchText.length > 0) {
			newFilter.push(["q", searchText]);
		}
		updateSearchParams(newFilter);
	};

	return (
		<article className="w-full">
			<h2 className="text-3xl md:text-4xl font-semibold pb-1">Reports</h2>
			<p className="text-sm md:text-lg">
				Find and fund reports that resonate with you.
			</p>
			<div className="flex gap-3 w-full py-4">
				<ReportsFilters
					isOpen={filterOverlayOpen}
					setIsOpen={setFilterOverlayOpen}
					filterOptions={{
						uniqueCategories,
						uniqueOutlets,
						uniqueStates,
						maxAmountNeeded,
						minAmountNeeded,
					}}
				/>

				<div className="flex flex-1 max-w-xl gap-2">
					<div className="relative w-full">
						<span className="absolute top-1/2 left-2 transform -translate-y-1/2">
							<Search className="text-vd-blue-600" />
						</span>
						<Input
							value={searchBarInput}
							className="pl-10 h-10 border-vd-blue-500 bg-vd-beige-100 py-2 text-[16px] font-medium placeholder:text-vd-blue-500/60 ring-offset-white focus-visible:ring-offset-2 focus-visible:ring-vd-blue-400 focus-visible:ring-2"
							placeholder="Search in title, summary"
							onChange={(e) => {
								handleSearch(e.target.value);
							}}
						/>
					</div>
				</div>

				{/* TODO: Add sorting options */}
				<Select
					name="sort"
					onValueChange={(value) => {
						setActiveSort(value);
					}}
				>
					<SelectTrigger className="max-w-[300px] min-w-[170px]">
						<SelectValue
							placeholder={
								activeSort ? sortingOptions[activeSort].label : "Sort by"
							}
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{Object.values(sortingOptions).map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				{/* <Select
						// key={dynamicKeyForInput}
						name="sort"
						onValueChange={(value) => {
							if (searchParams.has("sort")) {
								searchParams.delete("sort");
							}
							searchParams.append("sort", value);
							setSearchParams(searchParams);
							router.push(`reports/?${searchParams.toString()}`, {
								scroll: false,
							});
						}}
					>
						<SelectTrigger className="max-w-[300px] min-w-[170px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							{sortingOptions.map((option: string) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select> */}
				<Button
					className="text-xs"
					variant={"outline"}
					onClick={updateSearchParams.bind(null, [])}
				>
					Clear filters and search
				</Button>
				{/* </div> */}
			</div>
		</article>
	);
};

export default ReportsHeader;
