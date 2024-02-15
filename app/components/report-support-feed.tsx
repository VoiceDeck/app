import { usePagination } from "~/hooks/use-pagination";
import { cn } from "~/lib/utils";
import { Report } from "~/types";
import { Button } from "./ui/button";

interface IContribution {
	amount: number;
	visibility: string;
	date: string;
	supporter: string;
	message: string;
}

const reportTransactions: IContribution[] = [
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
		message:
			"The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be completed each time you hear this sound. [ding] Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start. ",
	},
	{
		amount: 75,
		visibility: "amount-hidden",
		date: "2024-04-25T23:55:45.417Z",
		supporter: "Liam",
		message: "Glad to support this cause, every little helps! ",
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
		message:
			"The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be completed each time you hear this sound. [ding] Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start.",
	},
	{
		amount: 200,
		visibility: "public",
		date: "2024-06-15T23:55:45.417Z",
		supporter: "William",
		message: "",
	},
	{
		amount: 250,
		visibility: "public",
		date: "2024-07-20T12:34:56.789Z",
		supporter: "Emily",
		message: "Keep up the great work!",
	},
	{
		amount: 175,
		visibility: "anonymous",
		date: "2024-08-05T08:30:00.123Z",
		supporter: "",
		message: "Happy to help for a good cause.",
	},
	{
		amount: 300,
		visibility: "amount-hidden",
		date: "2024-09-15T17:45:30.456Z",
		supporter: "Alex",
		message: "Inspiring initiative, proud to support!",
	},
];

const transformDate = (timestamp: string) =>
	new Date(timestamp).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

const MobileSupportFeed = ({
	transactions,
}: {
	transactions: IContribution[];
}) => {
	const {
		currentPage,
		currentPageItems: pageTransactions,
		loadPage,
		maxPage,
		pageNumbers,
		needsPagination,
	} = usePagination<IContribution>(transactions, 8);

	return (
		<section>
			{/* Transactions */}
			<ol className="flex flex-col gap-4 py-2">
				{pageTransactions.map((transaction, index) => (
					<li
						key={`${transaction.supporter}-${transaction.date}`}
						className="flex flex-col gap-2"
					>
						<p className="text-xs uppercase text-vd-orange-700 bg-vd-beige-300 px-2 py-2 rounded-md font-medium">
							{transformDate(transaction.date)}
						</p>
						<div className="px-2">
							<h5 className="text-sm font-semibold">
								{transaction.supporter || "Anonymous"} gave{" "}
								{transaction.amount && transaction.visibility === "public"
									? `$${transaction.amount}`
									: ""}
							</h5>
							<div className="p-1" />
							{transaction.message && (
								<div className="border-l-2 border-l-vd-blue-300 pl-2">
									<q className="py-2 text-vd-blue-700 text-sm">
										{transaction.message}
									</q>
								</div>
							)}
						</div>
					</li>
				))}
			</ol>

			{/* Pagination */}
			{needsPagination && (
				<div className="flex items-center gap-3 py-2">
					<Button
						onClick={() => loadPage(currentPage - 1)}
						variant="ghost"
						disabled={currentPage <= 1}
					>
						{"Prev"}
					</Button>

					{pageNumbers.map((page, index) => (
						<Button
							key={`page-${page}`}
							onClick={() => loadPage(page)}
							className={cn(
								"h-9 w-8 rounded-full border-vd-blue-400",
								currentPage === page
									? "border-2 border-vd-blue-700 ring-2 ring-vd-beige-300"
									: "",
							)}
							variant="outline"
						>
							{page}
						</Button>
					))}

					<Button
						onClick={() => loadPage(currentPage + 1)}
						variant="ghost"
						disabled={currentPage >= maxPage}
					>
						{"Next"}
					</Button>
				</div>
			)}
		</section>
	);
};

const ReportSupportFeed = ({ report }: { report: Report }) => {
	if (!reportTransactions.length) {
		return (
			<section>
				<h3 className="text-2xl font-semibold py-4">Support Feed</h3>
				<p className="text-neutral-500 dark:text-neutral-300">
					Nothing to show yet. Be the first to support this cause!
				</p>
			</section>
		);
	}
	const orderSupportByDate = reportTransactions?.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	return (
		<section>
			<h3 className="text-2xl font-semibold py-4">
				Support Feed ({orderSupportByDate.length})
			</h3>

			<MobileSupportFeed transactions={orderSupportByDate} />

			{/* <ol className="border-l border-neutral-300 dark:border-neutral-500">
		{transactions.map((transaction, index) => (
			<li key={`${transaction.supporter}-${transaction.date}`}>
				<div className="flex-start flex items-center pt-3">
					<div className="-ml-[5px] mr-3 h-[9px] w-[9px] rounded-full bg-neutral-300 dark:bg-neutral-500" />
					<p className="text-sm text-neutral-500 dark:text-neutral-300">
						{transformDate(transaction.date)}
					</p>
				</div>
				<div className="mb-6 ml-4 mt-2">
					<h4 className="mb-1.5 text-lg font-semibold">
						{transaction.supporter || "Anonymous"}
					</h4>
					<p className="mb-3 text-neutral-500 dark:text-neutral-300">
						{transaction.message}
					</p>
				</div>
			</li>
		))}
	</ol> */}
		</section>
	);
};

export default ReportSupportFeed;
