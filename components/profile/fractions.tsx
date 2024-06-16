import { HistoryCard } from "@/components/profile/history-card";
import type { Hex } from "viem";

export interface HistoryData {
	id: Hex;
	date: Date;
	amount: number;
	img: {
		src: string;
		alt: string;
	};
	title: string;
	category: string;
	location: string;
	description: string;
}

// TODO: Replace mockData with actual data from the API,
const History = ({ history }: { history: HistoryData[] }) => {
	const renderHistoryCards = () => {
		return history.map((data) => (
			<HistoryCard
				key={data.id}
				date={data.date}
				amount={data.amount}
				img={data.img}
				title={data.title}
				category={data.category}
				location={data.location}
				description={data.description}
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
			{history && history.length > 0
				? renderHistoryCards()
				: renderEmptyState()}
		</section>
	);
};

export default History;
