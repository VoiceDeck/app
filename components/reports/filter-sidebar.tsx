import { useFilters } from "@/contexts/filter";
import type { createFilterOptions } from "@/lib/search-filter-utils";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { FilterItems } from "./reports-filters";

interface SidebarFilterProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	filterOptions: ReturnType<typeof createFilterOptions>;
}

const SidebarFilter = ({
	isOpen,
	setIsOpen,
	filterOptions,
}: SidebarFilterProps) => {
	const { filters, updateSearchParams } = useFilters();
	const newFilters = filters.filter(([key]) => key === "q");

	return (
		<aside
			className={cn(
				"w-[350px] p-5 bg-vd-beige-100 border-r border-r-stone-300 transition-[margin-left] ease-[cubic-bezier(0.245, -0.045, 0.100, 1.145)] duration-500",
				isOpen ? "ml-0" : "ml-[-350px]",
			)}
		>
			<header className="flex justify-between">
				<h2 className="text-xl font-bold">Filters</h2>
				<section className="flex gap-4">
					<button
						type="button"
						className="text-vd-blue-700"
						onClick={() => updateSearchParams(newFilters)}
					>
						Clear filters
					</button>
					<button type="button" onClick={() => setIsOpen(false)}>
						<X size={24} />
					</button>
				</section>
			</header>
			<div className="p-4" />
			<section>
				<FilterItems filterOptions={filterOptions} />
			</section>
		</aside>
	);
};

export { SidebarFilter };
