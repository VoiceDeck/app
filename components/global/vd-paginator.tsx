"use client";
import { buttonVariants } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface IShowingDisplay {
	currentPage: number;
	reportsSize: number;
	itemsPerPage: number;
}

const ShowingDisplay = ({
	currentPage,
	reportsSize,
	itemsPerPage,
}: IShowingDisplay) => {
	return (
		<p className="text-sm md:text-base">
			Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
			{currentPage * itemsPerPage > reportsSize
				? reportsSize
				: currentPage * itemsPerPage}{" "}
			of {reportsSize} items
		</p>
	);
};

const calculatePaginationRange = (
	currentPage: number,
	maxPage: number,
	maxPagesInPagination: number,
) => {
	// Ensure we don't exceed the maxPage limit
	const totalPages = Math.min(maxPage, maxPagesInPagination);

	// Calculate the start page
	let startPage = Math.max(currentPage - Math.floor(totalPages / 2), 1);
	let endPage = startPage + totalPages - 1;

	// Adjust if endPage goes beyond maxPage
	if (endPage > maxPage) {
		endPage = maxPage;
		// Adjust startPage to ensure we always show the same number of pages
		startPage = Math.max(1, endPage - totalPages + 1);
	}

	// Generate the range of page numbers
	return Array.from(
		{ length: endPage - startPage + 1 },
		(_, index) => startPage + index,
	);
};

interface IVDPaginator {
	needsPagination: boolean;
	currentPage: number;
	maxPage: number;
	loadPage: (pageNum: number) => void;
	pageNumbers: number[];
}

const VDPaginator = ({
	needsPagination,
	currentPage,
	maxPage,
	loadPage,
	pageNumbers,
}: IVDPaginator) => {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const maxPagesInPagination = isDesktop ? 7 : 3;
	if (!needsPagination) {
		return null;
	}

	const pagesInPagination = calculatePaginationRange(
		currentPage,
		maxPage,
		maxPagesInPagination,
	);

	return (
		<Pagination className="pt-6">
			<PaginationContent>
				<PaginationItem className="hover:cursor-pointer">
					<PaginationPrevious
						onClick={() => (currentPage > 1 ? loadPage(currentPage - 1) : null)}
						className={cn(
							buttonVariants({ variant: "secondary", size: "sm" }),
							"bg-vd-beige-300 hover:bg-vd-beige-400",
							currentPage === 1
								? "cursor-not-allowed opacity-50 hover:bg-initial focus:bg-none"
								: "",
						)}
					/>
				</PaginationItem>

				{pagesInPagination.map((pageNum, index) => (
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
				<PaginationItem className="hover:cursor-pointer">
					<PaginationNext
						onClick={() =>
							currentPage < maxPage ? loadPage(currentPage + 1) : null
						}
						className={cn(
							buttonVariants({ variant: "secondary", size: "sm" }),
							"bg-vd-beige-300 hover:bg-vd-beige-400",
							currentPage === maxPage
								? "cursor-not-allowed opacity-50 hover:bg-initial focus:bg-none"
								: "",
						)}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};

export { ShowingDisplay, VDPaginator };
