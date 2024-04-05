'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * A custom React hook for handling pagination logic
 *
 * This is for client-side pagination. If you need server-side pagination, you should use Remix's loaders and navigation
 * Example: Use server-side for `Reports` page, and client-side for transactions within `Report` page.
 *
 * This hook takes an array of items and the number of items per page as inputs.
 * It provides the current page's items, the ability to load a specific page,
 * and pagination information such as the current page number, total pages, and if pagination is needed.
 *
 * @param {GT[]} items - The array of items to be paginated.
 * @param {number} itemsPerPage - The number of items to display per page.
 * @returns An object containing the current page's items, the current page number, a function to load a specific page, total pages, if pagination is needed, and an array of page numbers.
 *
 * @template GT - The generic type parameter allows for the use of this hook with any type of item array.
 */
export const usePagination = <GT,>(items: GT[], itemsPerPage: number) => {
	const [currentPage, setCurrentPage] = useState(1);
	const currentPageRef = useRef(currentPage);
	currentPageRef.current = currentPage;

	// `useMemo` because we don't want to recalculate these values on every render
	const maxPage = useMemo(
		() => Math.ceil(items.length / itemsPerPage),
		[items.length, itemsPerPage],
	);
	const needsPagination = useMemo(
		() => items.length > itemsPerPage,
		[items.length, itemsPerPage],
	);
	const pageNumbers = useMemo(() => {
      const range = Array.from({ length: 3 }, (_, i) => currentPage + i);
      return currentPage === 1 ? range : currentPage === maxPage ? range.map(num => num - 2) : range.map(num => num - 1);
  }, [maxPage, currentPage]);

	// no 'useMemo' for these, we need to recalculate to render correct reports
	// when filter/sort options are updated
	const start = (currentPage - 1) * itemsPerPage;
	const end = start + itemsPerPage;
	const currentPageItems = needsPagination ? items.slice(start, end) : items;

	// 'useCallback' because we don't want to recreate this function on every render
	const loadPage = useCallback(
		(pageNumber: number) => {
			if (!needsPagination || pageNumber < 1 || pageNumber > maxPage) return;
			setCurrentPage(pageNumber);
		},
		[needsPagination, maxPage],
	);

	// Use an effect to update the current page if needed based on the ref
	useEffect(() => {
		const currentPage = currentPageRef.current;
		if (!needsPagination || currentPage < 1 || currentPage > maxPage) {
			setCurrentPage(1);
		}
	}, [maxPage, needsPagination]);

	return {
		currentPage,
		currentPageItems,
		loadPage,
		maxPage,
		needsPagination,
		pageNumbers,
	};
};
