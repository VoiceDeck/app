import type { ISortingOption, Report } from "@/types";
import type Fuse from "fuse.js";
export const filterReports = (
  reports: Report[],
  filters: [string, string][],
  fuse: Fuse<Report>
) => {
  return filters.reduce((filteredReports, [key, value]) => {
    switch (key) {
      case "q": {
        const searchResults = fuse.search(value);
        return searchResults.map((result) => result.item);
      }
      case "state": {
        const states = filters
          .filter(([filterKey]) => filterKey === "state")
          .map(([, filterValue]) => filterValue);
        return filteredReports.filter((report) =>
          states.includes(report.state)
        );
      }
      case "min":
        return filteredReports.filter(
          (report) =>
            report.totalCost - report.fundedSoFar >= Number.parseInt(value, 10)
        );
      case "max":
        return filteredReports.filter(
          (report) =>
            report.totalCost - report.fundedSoFar <= Number.parseInt(value, 10)
        );
      case "category":
        return filteredReports.filter((report) => report.category === value);
      case "outlet": {
        const outlets = filters
          .filter(([filterKey]) => filterKey === "outlet")
          .map(([, filterValue]) =>
            decodeURIComponent(filterValue).toLowerCase()
          );
        return filteredReports.filter((report) => {
          if (!report.contributors.length) return false;
          const outletName = report.contributors[0].toLowerCase();
          return outlets.includes(outletName);
        });
      }
      default:
        return filteredReports;
    }
  }, reports);
};

export const createFilterOptions = (reports: Report[]) => {
  const uniqueCategories = reports
    .map((report: Report, index: number) => ({
      label: report.category,
      value: report.category,
    }))
    .filter(
      ({ value }, index, self) =>
        index === self.findIndex((obj) => obj.value === value)
    );

  const uniqueOutlets = reports
    .map((report: Report) => report.contributors[0])
    .filter((outlet) => outlet && outlet.length > 0)
    .map((outlet: string) => ({
      label: outlet,
      value: encodeURIComponent(outlet).toLowerCase(),
    }))
    .filter(
      ({ value }, index, self) =>
        index === self.findIndex((obj) => obj.value === value)
    );

  const uniqueStates = reports
    .map((report: Report, index: number) => ({
      label: report.state,
      value: report.state,
    }))
    .filter(
      ({ value }, index, self) =>
        index === self.findIndex((obj) => obj.value === value)
    );

  const amountsNeeded = reports.map(
    (report: Report) => report.totalCost - report.fundedSoFar || 0
  );
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
    label: "Newest to oldest",
    value: "createdNewestFirst",
    sortFn: (a: Report, b: Report) =>
      new Date(b.dateCreated || "").getTime() -
      new Date(a.dateCreated || "").getTime(),
  },
  createdOldestFirst: {
    label: "Oldest to newest",
    value: "createdOldestFirst",
    sortFn: (a: Report, b: Report) =>
      new Date(a.dateCreated || "").getTime() -
      new Date(b.dateCreated || "").getTime(),
  },
  amountNeededAsc: {
    label: "$ to $$$ needed",
    value: "amountNeededAsc",
    sortFn: (a: Report, b: Report) =>
      a.totalCost - a.fundedSoFar - (b.totalCost - b.fundedSoFar),
  },
  amountNeededDesc: {
    label: "$$$ to $ needed",
    value: "amountNeededDesc",
    sortFn: (a: Report, b: Report) =>
      b.totalCost - b.fundedSoFar - (a.totalCost - a.fundedSoFar),
  },
};
