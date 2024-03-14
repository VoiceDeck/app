'use client'
import ReportCard from "@/components/reports/report-card";
import ReportsHeader from "@/components/reports/reports-header";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import type { Report } from "@/types";
import Fuse from "fuse.js";
import Link from "next/link";
import { useMemo, useState } from "react";

interface IPageData {
	reports: Report[];
}

export function ReportsView ({ reports }: IPageData) {
    const [searchParams, setSearchParams] = useState(new URLSearchParams()); 

    const getSelectedReports = useMemo(() => {
      const category = searchParams.get("category");
      const searchInput = searchParams.get("q");
      const minAmount = Number(searchParams.get("min"));
      const maxAmount = Number(searchParams.get("max"));
      const states = searchParams.getAll("states");
      const outlets = searchParams.getAll("outlet");
      const sortBy = searchParams.get("sort");
      let selectedReports = reports;
      if (category) {
        selectedReports = selectedReports.filter(
          (report: Report) => report.category === category,
        );
      }
      if (searchInput) {
        const fuseOptions = {
          minMatchCharLength: 3,
          threshold: 0.5,
          ignoreDistance: true,
          findAllMatches: true,
          keys: ["title", "summary"],
        };
        const fuse = new Fuse(selectedReports, fuseOptions);
        const searchResults = fuse.search(searchInput);
        selectedReports = searchResults.map((result) => result.item);
      }
      if (searchParams.has("min")) {
        selectedReports = selectedReports.filter(
          (report: Report) =>
            maxAmount >= report.totalCost - report.fundedSoFar &&
            minAmount <= report.totalCost - report.fundedSoFar,
        );
      }
      if (states.length) {
        selectedReports = selectedReports.filter((report: Report) =>
          states.includes(report.state),
        );
      }
      if (outlets.length) {
        selectedReports = selectedReports.filter((report: Report) =>
          outlets.includes(report.contributors[0]),
        );
      }
      if (sortBy) {
        if (sortBy === "$ to $$$ needed") {
          selectedReports = selectedReports.sort(
            (a: Report, b: Report) => b.fundedSoFar - a.fundedSoFar,
          );
        }
        if (sortBy === "$$$ to $ needed") {
          selectedReports = selectedReports.sort(
            (a: Report, b: Report) => a.fundedSoFar - b.fundedSoFar,
          );
        }
        if (sortBy === "Newest to oldest") {
          selectedReports = selectedReports.sort(
            (a: Report, b: Report) =>
              Date.parse(b.dateCreated || "") - Date.parse(a.dateCreated || ""),
          );
        }
        if (sortBy === "Oldest to newest") {
          selectedReports = selectedReports.sort(
            (a: Report, b: Report) =>
              Date.parse(a.dateCreated || "") - Date.parse(b.dateCreated || ""),
          );
        }
      }
  
      return selectedReports;
    }, [reports, searchParams]);
  
    const {
      currentPage,
      currentPageItems: pageTransactions,
      loadPage,
      maxPage,
      pageNumbers,
      needsPagination,
      // set to 3 reports per page for testing because currently only 8 reports exist
    } = usePagination<Report>(getSelectedReports, 3);
  
    return (
      <article>

        <ReportsHeader
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          reports={reports}
        />

        {/* <section className="px-2 pb-16 md:pb-8"> */}
				<section>
          {/* <div className="grid grid-rows-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-5 max-w-screen-xl"> */}
					<div className="flex gap-5 flex-wrap justify-center md:justify-start">
            {getSelectedReports.length
              ? pageTransactions.map((report: Report) => (
                  <Link
                    href={`/reports/${report.slug}`}
                    key={report.hypercertId}
                    passHref
                  >
                    <ReportCard
                      hypercertId={report.hypercertId}
                      image={report.image}
                      title={report.title}
                      summary={report.summary}
                      category={report.category}
                      state={report.state}
                      totalCost={report.totalCost}
                      fundedSoFar={report.fundedSoFar}
                    />
                  </Link>
                ))
              : null}
          </div>

          {needsPagination && (
            <Pagination className="pt-6">
              <PaginationContent>
                <PaginationItem className="hover:cursor-pointer">
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 ? loadPage(currentPage - 1) : null
                    }
                  />
                </PaginationItem>
                {pageNumbers
                  .filter((pageNum) =>
                    [currentPage - 1, currentPage, currentPage + 1].includes(
                      pageNum,
                    ),
                  )
                  .map((pageNum, index) => (
                    <PaginationItem
                      onClick={() => loadPage(pageNum)}
                      className="hover:cursor-pointer"
                      key={`page-${pageNum}`}
                    >
                      <PaginationLink isActive={currentPage === pageNum}>
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                {maxPage > 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem className="hover:cursor-pointer">
                  <PaginationNext
                    onClick={() =>
                      currentPage < maxPage ? loadPage(currentPage + 1) : null
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </section>
  
        {!getSelectedReports.length ? (
          <section>
            <div className="flex flex-col items-center text-center pb-24 md:pb-10">
              <img
                className="h-20 w-20"
                src="/reports_not_found.svg"
                alt="flower illustration"
              />
              <p className="text-vd-beige-600">
                No reports matched your request.
              </p>
              <p className="text-vd-beige-600">
                Please remove some of your filters and try again.
              </p>
            </div>
          </section>
        ) : null}
      </article>
    );
  }