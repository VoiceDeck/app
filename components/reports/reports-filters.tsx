import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { useFilters } from "@/contexts/filter";
import type { createFilterOptions } from "@/lib/search-filter-utils";
import { Filter } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DynamicCategoryIcon } from "../ui/dynamic-category-icon";
import { StateCombobox } from "./states-combobox";

interface ReportFiltersProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	filterOptions: ReturnType<typeof createFilterOptions>;
}
interface FilterItemsProps {
	filterOptions: ReturnType<typeof createFilterOptions>;
}

export const FilterItems: React.FC<FilterItemsProps> = ({
	filterOptions: {
		uniqueCategories,
		uniqueOutlets,
		uniqueStates,
		minAmountNeeded,
		maxAmountNeeded,
	},
}) => {
	const { filters, updateSearchParams } = useFilters();

	const handleOutletSelection = (outlet: string) => {
		const outletExists = filters.some(
			([key, value]) => key === "outlet" && value === outlet,
		);
		const newFilter = filters.filter(([key, _]) => key !== "outlet");
		if (!outletExists) {
			newFilter.push(["outlet", outlet]);
		}
		updateSearchParams(newFilter);
	};

	const handleAmountNeededRangeChange = (range: number[]) => {
		const newFilter = filters.filter(
			([key, _]) => key !== "min" && key !== "max",
		);
		newFilter.push(["min", String(range[0])]);
		newFilter.push(["max", String(range[1])]);
		updateSearchParams(newFilter);
	};

	const handleStateSelection = (state: string) => {
		let newFilter = filters.filter(([key, _]) => key !== "state");

		if (state !== "remove-all") {
			const existingStates = new Set(
				filters
					.filter(([key, _]) => key === "state")
					.map(([_, value]) => value),
			);

			if (existingStates.has(state)) {
				existingStates.delete(state);
			} else {
				existingStates.add(state);
			}

			newFilter = [
				...newFilter,
				...Array.from(existingStates).map(
					(stateValue) => ["state", stateValue] as [string, string],
				),
			];
		}

		updateSearchParams(newFilter);
	};

	const selectedCategory = filters
		.filter(([key, _]) => key === "category")
		.map(([_, value]) => value)
		.join("");

	const handleCategoryChange = (category: string) => {
		const isSameCategory = selectedCategory === category;
		const newFilter = filters.filter(([key, _]) => key !== "category");
		if (category && !isSameCategory) {
			newFilter.push(["category", category]);
		}
		updateSearchParams(newFilter);
	};

	const selectedStates = filters
		.filter(([key, _]) => key === "state")
		.map(([_, value]) => value);

	const activeMin =
		Number(filters.find(([key, _]) => key === "min")?.[1]) || minAmountNeeded;

	const activeMax =
		Number(filters.find(([key, _]) => key === "max")?.[1]) || maxAmountNeeded;

	return (
		<div className="flex flex-col gap-8">
			<section>
				<h2 className="font-medium pb-2">Category</h2>
				<div className="flex gap-2">
					{uniqueCategories.map(
						(category: { label: string; value: string }) => (
							<Badge
								key={category.value}
								className={`border-vd-blue-500 rounded-full flex flex-auto flex-col md:flex-row items-center gap-1 px-3 py-2 cursor-pointer ${
									selectedCategory === category.value
										? "bg-vd-blue-900 text-vd-beige-100 hover:bg-vd-blue-700"
										: ""
								}`}
								onClick={() => handleCategoryChange(category.value)}
							>
								<DynamicCategoryIcon category={category.value} />
								<p className="text-xs">{category.label}</p>
							</Badge>
						),
					)}
				</div>
			</section>
			{/* <div className="p-5" /> */}
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
						onValueChange={(e) => handleAmountNeededRangeChange([e[0], e[1]])}
					/>
				</div>
				<div className="p-5" />
			</section>

			<section>
				<h2 className="font-medium pb-2 md:pb-4">State impacted</h2>
				<StateCombobox
					states={uniqueStates}
					handleStateSelection={handleStateSelection}
					selectedStates={selectedStates}
				/>
			</section>

			<section>
				<h2 className="font-medium pb-2 md:pb-4">Media outlet</h2>
				{uniqueOutlets.map((outlet: { label: string; value: string }) => (
					<div key={outlet.label} className="flex items-center gap-2 pb-2">
						<Checkbox
							className="h-6 w-6 rounded-md border-vd-blue-500 data-[state=checked]:bg-vd-blue-500 data-[state=checked]:text-vd-beige-100"
							onClick={() => handleOutletSelection(outlet.value)}
						/>
						<p className="text-sm">{outlet.value}</p>
					</div>
				))}
			</section>
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
				<Drawer>
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
					<DrawerContent className="px-6 pb-3">
						<FilterItems filterOptions={filterOptions} />
						{/* <DrawerFooter className="flex-row justify-center gap-2 pb-8">
							<DrawerClose>
								<Button
									className="px-24 py-4"
								>
									Apply
								</Button>
							</DrawerClose>
						</DrawerFooter> */}
					</DrawerContent>
				</Drawer>
			</div>
			<div className="hidden md:flex">
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

				{/* KEEPING THIS FOR FALLBACK */}
				{/* <Dialog>
					<DialogTrigger
						className="flex gap-2 h-10 w-full rounded-md border-input justify-between items-center bg-vd-beige-100 border border-vd-blue-500 px-3 py-2"
						onClick={() => {
							setAmountRangeSelected([minAmountNeeded, maxAmountNeeded]);
							setOutletsSelected([]);
							setStatesSelected([]);
						}}
					>
						<p className="text-sm font-medium text-vd-blue-500">Filters</p>
						{numFiltersApplied > 0 ? (
							<div className="bg-vd-blue-100 rounded-full text-xs font-medium text-vd-blue-500 px-2 py-1">
								{numFiltersApplied}
							</div>
						) : (
							<Filter color="#4B778F" size={16} />
						)}
					</DialogTrigger>
					<DialogContent className="bg-vd-beige-200">
						<FilterItems
							outlets={outlets}
							states={states}
							statesSelected={statesSelected}
							minAmountNeeded={minAmountNeeded}
							maxAmountNeeded={maxAmountNeeded}
							amountRangeSelected={amountRangeSelected}
							setAmountRangeSelected={setAmountRangeSelected}
							setStatesSelected={setStatesSelected}
							outletsSelected={outletsSelected}
							setOutletsSelected={setOutletsSelected}
						/>
						<DialogFooter className="justify-end gap-2 pb-4">
							<DialogClose asChild>
								<Button
									className="px-24 py-4"
									onClick={() => handleApplyFilters()}
								>
									Apply
								</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog> */}
			</div>
		</div>
	);
};

export default ReportsFilters;
