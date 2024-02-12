import { Report } from "~/types";

const reportTransactions = [
	{
		amount: 100,
		visibility: "public",
		date: "2024-01-31T23:55:45.417Z",
		supporter: "Arvind",
		message:
			"This was important for my family lived in the village, thank you for your work.",
	},
	{
		amount: 45,
		visibility: "amount-hidden",
		date: "2024-03-16T23:55:45.417Z",
		supporter: "Shannon",
		message: "Awesome work! Looking forward to more",
	},
	{
		amount: 63,
		visibility: "anonymous",
		date: "2024-01-31T23:55:45.417Z",
		supporter: "Arvind",
		message: "Would give more but this is all I got right now",
	},
	{
		amount: 120,
		visibility: "public",
		date: "2024-02-14T23:55:45.417Z",
		supporter: "Maya",
		message: "Your initiative is inspiring, keep pushing forward!",
	},
	{
		amount: 75,
		visibility: "amount-hidden",
		date: "2024-04-25T23:55:45.417Z",
		supporter: "Liam",
		message: "Glad to support this cause, every little helps!",
	},
	{
		amount: 90,
		visibility: "anonymous",
		date: "2024-05-30T23:55:45.417Z",
		supporter: "",
		message: "Hope this contribution helps.",
	},
	{
		amount: 150,
		visibility: "public",
		date: "2024-06-15T23:55:45.417Z",
		supporter: "Sophia",
		message: "Proud to support such an important cause!",
	},
];

const transformDate = (timestamp: string) =>
	new Date(timestamp).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

const ReportSupportFeed = ({ report }: { report: Report }) => {
	const orderSupportByDate = reportTransactions.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	return (
		<section>
			<h3 className="font-semibold text-2xl">Support feed</h3>
			<ol className="border-l border-neutral-300 dark:border-neutral-500">
				<li>
					<div className="flex-start flex items-center pt-3">
						<div className="-ml-[5px] mr-3 h-[9px] w-[9px] rounded-full bg-neutral-300 dark:bg-neutral-500" />
						<p className="text-sm text-neutral-500 dark:text-neutral-300">
							01.07.2021
						</p>
					</div>
					<div className="mb-6 ml-4 mt-2">
						<h4 className="mb-1.5 text-xl font-semibold">Arvind</h4>
						<p className="mb-3 text-neutral-500 dark:text-neutral-300">
							This was important for my family lived in the village, thank you
							for your work.
						</p>
					</div>
				</li>
				<li>
					<div className="flex-start flex items-center pt-3">
						<div className="-ml-[5px] mr-3 h-[9px] w-[9px] rounded-full bg-neutral-300 dark:bg-neutral-500" />
						<p className="text-sm text-neutral-500 dark:text-neutral-300">
							01.07.2021
						</p>
					</div>
					<div className="mb-6 ml-4 mt-2">
						<h4 className="mb-1.5 text-xl font-semibold">Arvind</h4>
						<p className="mb-3 text-neutral-500 dark:text-neutral-300">
							This was important for my family lived in the village, thank you
							for your work.
						</p>
					</div>
				</li>
			</ol>
		</section>
	);
};

export default ReportSupportFeed;
