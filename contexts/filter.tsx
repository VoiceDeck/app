'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';


interface FilterContextType {
	filters: [string, string][];
	numFiltersApplied: number;
	updateSearchParams: (newFilters: [string, string][]) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const {replace} = useRouter();
	const pathname = usePathname();
	const params = useSearchParams();
	const paramEntries = Array.from(params.entries());
	const [filters, setFilters] = useState(paramEntries);

	// If the 'q' parameter is present, it is considered a search query, so don't count it as a filter
	const numFiltersApplied = new Set(paramEntries.filter(paramEntry => paramEntry[0] !== 'q')
		.map(paramEntry => paramEntry[0] === 'min' || paramEntry[0] === 'max' ? 'min-max' : paramEntry[0]))
		.size;

	const updateSearchParams = (newFilters: [string, string][]) => {
		const searchParams = new URLSearchParams();
		newFilters.forEach(([key, value]) => {
			searchParams.append(key, value);
		});
		replace(`${pathname}?${searchParams}`, {scroll: false});
	}

	useEffect(() => {
		// Parse the current URL search params and update the state
		const searchParams = new URLSearchParams(window.location.search);
		const updatedFilters = Array.from(searchParams.entries());
		setFilters(updatedFilters);
	}, [params]); // Re-run this effect if the URL changes
	return (
		<FilterContext.Provider value={{ filters, numFiltersApplied, updateSearchParams }}>
			{children}
		</FilterContext.Provider>
	);
};

export const useFilters = () => {
	const context = useContext(FilterContext);
	if (context === undefined) {
		throw new Error('useFilters must be used within a FilterProvider');
	}
	return context;
};
