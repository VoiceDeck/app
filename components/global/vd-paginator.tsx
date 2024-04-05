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
		<p>
			Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
			{currentPage * itemsPerPage > reportsSize
				? reportsSize
				: currentPage * itemsPerPage}{" "}
			of {reportsSize} results
		</p>
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
	const maxPagesInPagination = isDesktop ? 9 : 5;
	if (!needsPagination) {
		return null;
	}

	//  Get the page numbers to display in the pagination, and try to keep the current page in the middle
	const pagesInPagination = pageNumbers.slice(
		Math.max(0, currentPage - 1 - Math.floor(maxPagesInPagination / 2)),
		Math.min(
			pageNumbers.length,
			currentPage - 1 + Math.ceil(maxPagesInPagination / 2),
		),
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
