import { HistoryCard } from "~/components/my-actions/history-card";

export interface HistoryData {
	id: number;
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
	return (
		<section className="flex flex-col gap-4 md:col-start-1 md:col-span-2 md:mt-2">
			<h2 className="text-xl md:text-3xl font-semibold text-center md:text-left md:py-6">
				Supporting History
			</h2>
			{history ? (
				history.map((data) => (
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
				))
			) : (
				<div className="text-center flex flex-col gap-6 md:px-20">
					<img src="/history-bg.svg" alt="circular pattern" />
					<p className="text-vd-beige-600 px-8">
						When you start supporting reports they will appear here.
					</p>
				</div>
			)}
		</section>
	);
};

History.displayName = "History";

export { History };
