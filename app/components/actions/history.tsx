import { HistoryCard } from "~/components/actions/history-card";
import historyImg from "/sample-history-img.jpeg";

const mockData = [
	{
		id: 1,
		date: new Date("2021-10-28"),
		amount: 45.0,
		img: {
			src: historyImg,
			alt: "sample history image",
		},
		title: "Construction of a Dobha in Giridih District",
		category: "Explore",
		location: "Jammu and Kashmir",
		description:
			"lorem ipsum msg from the user after complete transaction, should just display max. 1 line here then editable on the report detail page.",
	},
	{
		id: 2,
		date: new Date("2021-06-18"),
		amount: 145.0,
		img: {
			src: historyImg,
			alt: "another sample history image",
		},
		title: "Construction of a well in Rishikesh",
		category: "Thirst",
		location: "Rishikesh",
		description:
			"lorem ipsum msg from the user after complete transaction, should just display max. 1 line here then editable on the report detail page.",
	},
];

const History = () => {
	return (
		<section className="flex flex-col gap-4 md:col-start-1 md:col-span-2 md:mt-6">
			<h2 className="text-xl font-semibold text-center md:text-left md:py-4">
				Supporting History
			</h2>
			<div className="text-center flex flex-col gap-6 md:px-20">
				<img src="/history-bg.svg" alt="circular pattern" />
				<p className="text-vd-beige-600 px-8">
					When you start supporting reports they will appear here.
				</p>
			</div>
			{mockData.map((data) => (
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
			))}
		</section>
	);
};

History.displayName = "History";

export { History };
