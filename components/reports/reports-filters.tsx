import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { DynamicCategoryIcon } from "@/components/ui/dynamic-category-icon";
import { Slider } from "@/components/ui/slider";
import { useFilters } from "@/contexts/filter";
import type { createFilterOptions } from "@/lib/search-filter-utils";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { OutletCombobox } from "./outlet-combobox";
import { StateCombobox } from "./states-combobox";

interface ReportFiltersProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	filterOptions: ReturnType<typeof createFilterOptions>;
}
interface FilterItemsProps {
	isMobileFilter: boolean;
	filterOptions: ReturnType<typeof createFilterOptions>;
}

export const FilterItems: React.FC<FilterItemsProps> = ({
	isMobileFilter,
	filterOptions: {
		uniqueCategories,
		uniqueOutlets,
		uniqueStates,
		minAmountNeeded,
		maxAmountNeeded,
	},
}) => {
	const { filters, updateSearchParams } = useFilters();
	const [localFilters, setLocalFilters] = useState(filters);

	useEffect(() => {
		setLocalFilters([...filters]);
	}, [filters]);

	const applyFilters = useCallback(() => {
		updateSearchParams(localFilters);
	}, [localFilters, updateSearchParams]);

	const handleStateSelection = useCallback(
		(state: string) => {
			if (state === "remove-all") {
				const filtersWithoutStates = localFilters.filter(
					([key]) => key !== "state",
				);
				setLocalFilters(filtersWithoutStates);
			} else {
				const existingStates = new Set(
					localFilters
						.filter(([key]) => key === "state")
						.map(([, value]) => value),
				);
				if (existingStates.has(state)) {
					existingStates.delete(state);
				} else {
					existingStates.add(state);
				}
				const updatedFilters = localFilters.filter(([key]) => key !== "state");
				for (const stateValue of existingStates) {
					updatedFilters.push(["state", stateValue]);
				}
				setLocalFilters(updatedFilters);
			}
		},
		[localFilters],
	);
	const handleOutletSelection = useCallback(
		(outlet: string) => {
			if (outlet === "remove-all") {
				const filtersWithoutOutlets = localFilters.filter(
					([key]) => key !== "outlet",
				);
				setLocalFilters(filtersWithoutOutlets);
			} else {
				const existingOutlets = new Set(
					localFilters
						.filter(([key]) => key === "outlet")
						.map(([, value]) => value),
				);
				if (existingOutlets.has(outlet)) {
					existingOutlets.delete(outlet);
				} else {
					existingOutlets.add(outlet);
				}
				const updatedFilters = localFilters.filter(([key]) => key !== "outlet");
				for (const outletValue of existingOutlets) {
					updatedFilters.push(["outlet", outletValue]);
				}
				setLocalFilters(updatedFilters);
			}
		},
		[localFilters],
	);

	const selectedCategory = useMemo(
		() => localFilters.find(([key]) => key === "category")?.[1] || "",
		[localFilters],
	);

	const handleCategoryChange = useCallback(
		(category: string) => {
			const updatedFilters = localFilters.filter(([key]) => key !== "category");
			if (category !== "") {
				updatedFilters.push(["category", category]);
			}
			setLocalFilters(updatedFilters);
		},
		[localFilters],
	);

	const selectedStates = useMemo(
		() =>
			localFilters.filter(([key]) => key === "state").map(([, value]) => value),
		[localFilters],
	);

	const selectedOutlets = useMemo(
		() =>
			localFilters
				.filter(([key]) => key === "outlet")
				.map(([, value]) => value),
		[localFilters],
	);

	const activeMin = useMemo(
		() =>
			Number(localFilters.find(([key]) => key === "min")?.[1]) ||
			minAmountNeeded,
		[localFilters, minAmountNeeded],
	);

	const activeMax = useMemo(
		() =>
			Number(localFilters.find(([key]) => key === "max")?.[1]) ||
			maxAmountNeeded,
		[localFilters, maxAmountNeeded],
	);

	return (
		<div className="flex flex-col gap-8">
			{!isMobileFilter && (
				<Button onClick={applyFilters} className="w-full">
					Apply filters
				</Button>
			)}
			<section>
				<h2 className="font-medium pb-2">Category</h2>
				<div className="flex flex-wrap gap-2">
					{uniqueCategories.map(({ label, value }) => (
						<Badge
							key={value}
							className={`border-vd-blue-500 rounded-2xl flex flex-auto flex-col items-center gap-1 px-2 py-3 cursor-pointer ${
								selectedCategory === value
									? "bg-vd-blue-900 text-vd-beige-100 hover:bg-vd-blue-700"
									: ""
							}`}
							onClick={() => handleCategoryChange(value)}
						>
							<DynamicCategoryIcon category={value} />
							<p className="text-xs">{label}</p>
						</Badge>
					))}
				</div>
			</section>
			<section className="pt-4">
				<h2 className="font-medium">Amount needed to complete funding</h2>
				<div className="p-2" />
				<div className="w-full px-4">
					<Slider
						defaultValue={[activeMin, activeMax]}
						min={minAmountNeeded}
						max={maxAmountNeeded}
						step={1}
						minStepsBetweenThumbs={50}
						onValueChange={(value) => {
							const updatedFilters = localFilters.filter(
								([key]) => key !== "min" && key !== "max",
							);
							updatedFilters.push(
								["min", String(value[0])],
								["max", String(value[1])],
							);
							setLocalFilters(updatedFilters);
						}}
					/>
				</div>
				<div className="p-5" />
			</section>
			{/* TODO: Remove these filter from logic. Saving for reference  */}
			{/* <section>
				<p className="font-medium pb-2 text-base">
					States impacted{" "}
					<span className="text-sm text-stone-500">
						{" "}
						({uniqueStates.length})
					</span>
				</p>
				<StateCombobox
					states={uniqueStates}
					handleStateSelection={handleStateSelection}
					selectedStates={selectedStates}
				/>
			</section> */}

			{/* <section className="flex flex-col gap-2">
				<h2 className="font-medium pb-2 md:pb-4">Media outlet</h2>
				<OutletCombobox
					outlets={uniqueOutlets}
					selectedOutlets={selectedOutlets}
					handleOutletSelection={handleOutletSelection}
				/>
			</section> */}
			{isMobileFilter && (
				<DrawerFooter className="flex flex-wrap justify-center gap-2">
					<section className="flex flex-wrap gap-2">
						<div className="flex gap-2 w-full">
							<DrawerClose
								className={cn(
									buttonVariants({ variant: "secondary" }),
									"flex-1",
								)}
								onClick={() =>
									updateSearchParams(filters.filter(([key, _]) => key === "q"))
								}
							>
								Clear filters
							</DrawerClose>
							<DrawerClose
								className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
							>
								Cancel
							</DrawerClose>
						</div>
					</section>
					<DrawerClose
						onClick={applyFilters}
						className={cn(buttonVariants({ variant: "default" }), "w-full")}
					>
						Apply
					</DrawerClose>
				</DrawerFooter>
			)}
		</div>
	);
};

const ReportsFilters: React.FC<ReportFiltersProps> = ({
	isOpen,
	setIsOpen,
	filterOptions,
}) => {
	const { filters, numFiltersApplied } = useFilters();

	return (
		<div>
			<div className="md:hidden">
				<Drawer dismissible={false}>
					<div className="relative">
						{numFiltersApplied !== 0 && (
							<div className="bg-vd-blue-100 rounded-full text-xs font-medium text-vd-blue-500 px-2 py-1 h-6 w-6 absolute -right-2 -top-2">
								{numFiltersApplied}
							</div>
						)}
						<DrawerTrigger
							className="flex gap-2 h-10 rounded-md border-input justify-between
							items-center bg-vd-beige-100 border border-vd-blue-500 px-3 py-2
							text-vd-blue-500 hover:text-vd-blue-100 overflow-visible"
						>
							<Filter size={16} />
							<p className="text-sm font-medium">Filters</p>
						</DrawerTrigger>
					</div>
					<DrawerContent className="px-6 py-3">
						<FilterItems isMobileFilter={true} filterOptions={filterOptions} />
					</DrawerContent>
				</Drawer>
			</div>

			<div className="hidden md:flex min-[2560px]:hidden">
				<div className="relative">
					{numFiltersApplied !== 0 && (
						<div className="bg-vd-blue-100 rounded-full text-xs font-medium text-vd-blue-500 px-2 py-1 h-6 w-6 absolute -right-2 -top-2">
							{numFiltersApplied}
						</div>
					)}

					<Button
						className="flex gap-2 h-10 rounded-md border-input justify-between items-center bg-vd-beige-100 border border-vd-blue-500 px-3 py-2 text-vd-blue-500 hover:text-vd-blue-100 overflow-visible"
						onClick={() => setIsOpen(!isOpen)}
					>
						<Filter size={16} />
						<p className="text-sm font-medium">Filters</p>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ReportsFilters;
