import type { Fraction } from "@/app/profile/[address]/page";
import { FractionCard } from "./fraction-card";

// TODO: Replace mockData with actual data from the API,
const History = ({ fractions }: { fractions: Fraction[] }) => {
	const renderHistoryCards = () => {
		return fractions.map((fraction) => (
			<FractionCard
				key={fraction.id}
				id={fraction.id}
				units={fraction.units}
				hypercert_id={fraction.hypercert_id}
				owner_address={fraction.owner_address}
				work_timeframe_from={fraction.metadata.work_timeframe_from}
				work_timeframe_to={fraction.metadata.work_timeframe_to}
				work_scope={fraction.metadata.work_scope}
				contributors={fraction.metadata.contributors}
				external_url={fraction.metadata.external_url}
				image={fraction.metadata.image}
				name={fraction.metadata.name}
				description={fraction.metadata.description}
			/>
		));
	};

	const renderEmptyState = () => {
		return (
			<div className="flex flex-col gap-6 text-center md:px-20">
				<img src="/history-bg.svg" alt="circular pattern" />
				<p className="px-8 text-vd-beige-600">
					When you start supporting different causes they will appear here.
				</p>
			</div>
		);
	};

	return (
		<section className="flex flex-col gap-4 md:col-span-2 md:col-start-1 md:mt-2">
			<h2 className="text-center font-semibold text-xl md:py-6 md:text-left md:text-3xl">
				Supporting History
			</h2>
			{fractions && fractions.length > 0
				? renderHistoryCards()
				: renderEmptyState()}
		</section>
	);
};

export default History;
