import { ISortingOption, Report } from "@/types";
import type Fuse from "fuse.js";

export const filterReports = (
  reports: Report[],
  filters: [string, string][],
  fuse: Fuse<Report>
) => {
  return filters.reduce((filteredReports, [key, value]) => {
    switch (key) {
      case "q":
        const searchResults = fuse.search(value);
        return searchResults.map((result) => result.item);
      case "state":
        return filteredReports.filter((report) => value.includes(report.state));
      case "min":
        return filteredReports.filter(
          (report) => report.totalCost - report.fundedSoFar >= parseInt(value)
        );
      case "max":
        return filteredReports.filter(
          (report) => report.totalCost - report.fundedSoFar <= parseInt(value)
        );
      case "category":
        return filteredReports.filter((report) => report.category === value);
      case "outlet":
        return filteredReports.filter((report) => {
          if (!report.contributors.length) return false;
          return (
            value === report.contributors[0].split(" ").join("").toLowerCase()
          );
        });
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
    .filter((report: Report) => report.contributors[0]?.length > 0)
    .map((report: Report, index: number) => ({
      label: report.contributors[0],
      value: report.contributors[0].split(" ").join("").toLowerCase(),
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
  amountNeededAsc: {
    label: "$ to $$$ needed",
    value: "amountNeededAsc",
    sortFn: (a: Report, b: Report) => a.totalCost - b.totalCost,
  },
  amountNeededDesc: {
    label: "$$$ to $ needed",
    value: "amountNeededDesc",
    sortFn: (a: Report, b: Report) => b.totalCost - a.totalCost,
  },
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
};
