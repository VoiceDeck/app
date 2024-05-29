import type { ISortingOption, Report } from "@/types";
import type Fuse from "fuse.js";

export const filterReports = (
	reports: Report[],
	filters: [string, string][],
	fuse: Fuse<Report>,
) => {
	// search first
	let searchedReports = reports;
	const searchQuery = filters.find(([filterKey]) => filterKey === "q")?.[1];
	if (searchQuery) {
		const searchResults = fuse.search(searchQuery);
		searchedReports = searchResults.map((result) => result.item);
	}

	// pre-process filters
	const statesSet = new Set(
		filters
			.filter(([filterKey]) => filterKey === "state")
			.map(([, filterValue]) => filterValue),
	);
	const outletsSet = new Set(
		filters
			.filter(([filterKey]) => filterKey === "outlet")
			.map(([, filterValue]) => decodeURIComponent(filterValue).toLowerCase()),
	);

	const minAmountFromFilter = filters.find(
		([filterKey]) => filterKey === "min",
	)?.[1];
	const maxAmountFromFilter = filters.find(
		([filterKey]) => filterKey === "max",
	)?.[1];
	const minAmount = minAmountFromFilter
		? Number.parseInt(minAmountFromFilter, 10)
		: null;
	const maxAmount = maxAmountFromFilter
		? Number.parseInt(maxAmountFromFilter, 10)
		: null;

	return searchedReports.filter((report) => {
		const remainingCost = report.totalCost - report.fundedSoFar;
		// check state filter
		if (statesSet.size > 0 && !statesSet.has(report.state)) return false;
		// check outlet filter
		if (outletsSet.size > 0 && report.contributors.length) {
			const outletName = report.contributors[0].toLowerCase();
			if (!outletName || !outletsSet.has(outletName)) return false;
		}
		// check category
		if (
			filters.some(
				([key, value]) => key === "category" && report.category !== value,
			)
		) {
			return false;
		}

		// check min and max amount filter
		if (minAmount !== null && remainingCost < minAmount) return false;
		if (maxAmount !== null && remainingCost > maxAmount) return false;

		return true;
	});
};

export const createFilterOptions = (reports: Report[]) => {
	const uniqueCategoriesMap = new Map();
	const uniqueOutletsMap = new Map();
	const uniqueStatesMap = new Map();
	const amountsNeeded = [];

	for (let i = 0; i < reports.length; i++) {
		const report = reports[i];
		uniqueCategoriesMap.set(report.category, {
			label: report.category,
			value: report.category,
		});
		if (report.contributors[0] && report.contributors[0].length > 0) {
			uniqueOutletsMap.set(report.contributors[0].toLowerCase(), {
				label: report.contributors[0],
				value: encodeURIComponent(report.contributors[0]).toLowerCase(),
			});
		}
		uniqueStatesMap.set(report.state, {
			label: report.state,
			value: report.state,
		});
		amountsNeeded.push(report.totalCost - report.fundedSoFar || 0);
	}

	const uniqueCategories = Array.from(uniqueCategoriesMap.values());
	const uniqueOutlets = Array.from(uniqueOutletsMap.values());
	const uniqueStates = Array.from(uniqueStatesMap.values());
	const minAmountNeeded = Math.min(...amountsNeeded);
	const maxAmountNeeded = Math.max(...amountsNeeded);

	return {
		uniqueCategories,
		uniqueOutlets,
		uniqueStates,
		minAmountNeeded,
		maxAmountNeeded,
	};
};

export const sortingOptions: Record<string, ISortingOption> = {
	createdNewestFirst: {
		label: "New to old",
		value: "createdNewestFirst",
		sortFn: (a: Report, b: Report) =>
			new Date(b.dateCreated || "").getTime() -
			new Date(a.dateCreated || "").getTime(),
	},
	createdOldestFirst: {
		label: "Old to new",
		value: "createdOldestFirst",
		sortFn: (a: Report, b: Report) =>
			new Date(a.dateCreated || "").getTime() -
			new Date(b.dateCreated || "").getTime(),
	},
	amountNeededAsc: {
		label: "$ needed: High to low",
		value: "amountNeededAsc",
		sortFn: (a: Report, b: Report) =>
			a.totalCost - a.fundedSoFar - (b.totalCost - b.fundedSoFar),
	},
	amountNeededDesc: {
		label: "$ needed: Low to high",
		value: "amountNeededDesc",
		sortFn: (a: Report, b: Report) =>
			b.totalCost - b.fundedSoFar - (a.totalCost - a.fundedSoFar),
	},
};
