"use client";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { truncateEthereumAddress } from "@/lib/utils";
import type { Contribution } from "@/types";
import { DotIcon } from "lucide-react";

// const sampleContributions: Contribution[] = [
// 	{
// 		txid: "0x123",
// 		hypercert_id: "0xabc",
// 		amount: 100,
// 		date_created: "2024-01-31T23:55:45.417Z",
// 		sender: "0x3fD3A5699c3F3b2FB91688F8CD573eF4f8c4EbDA",
// 		comment:
// 			"This was important for my family lived in the village, thank you for your work.",
// 	},
// 	{
// 		txid: "0x456",
// 		hypercert_id: "0xdef",
// 		amount: 45,
// 		date_created: "2024-03-16T23:55:45.417Z",
// 		sender: "0xBeB6fdF4efAd81b6328b68c8aBbF2aC3aB774781",
// 		comment: "Awesome work! Looking forward to more",
// 	},
// 	{
// 		txid: "0x789",
// 		hypercert_id: "0xghi",
// 		amount: 63,
// 		date_created: "2024-01-31T23:55:45.417Z",
// 		sender: "0x6AaF6C2DA9F3A9C2C13835B5FfE104bC8D042F3B",
// 		comment: "Would give more but this is all I got right now",
// 	},
// 	{
// 		txid: "0x101112",
// 		hypercert_id: "0xjkl",
// 		amount: 120,
// 		date_created: "2024-02-14T23:55:45.417Z",
// 		sender: "0x8eB0452cEBCfBf5BbE6c1aD24f2Ba2D29B0B04C5",
// 		comment:
// 			"The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be completed each time you hear this sound. [ding] Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start. ",
// 	},
// 	{
// 		txid: "0x131415",
// 		hypercert_id: "0xmn0",
// 		amount: 75,
// 		date_created: "2024-04-25T23:55:45.417Z",
// 		sender: "0x7e5F4552091A69125d5DfCb7b8C2659029395Bdf",
// 		comment: "Glad to support this cause, every little helps! ",
// 	},
// 	{
// 		txid: "0x161718",
// 		hypercert_id: "0xpqr",
// 		amount: 90,
// 		date_created: "2024-05-30T23:55:45.417Z",
// 		sender: "0x2F4B8fF5E0F6e200B9Cf57244A8058AeF0Dd3F4F",
// 		comment: "Hope this contribution helps.",
// 	},
// 	{
// 		txid: "0x192021",
// 		hypercert_id: "0xstu",
// 		amount: 150,
// 		date_created: "2024-06-15T23:55:45.417Z",
// 		sender: "0xDbC941fEc34e8965EbC4A25452ae7519d6BDa193",
// 		comment:
// 			"The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be completed each time you hear this sound. [ding] Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start.",
// 	},
// 	{
// 		txid: "0x222324",
// 		hypercert_id: "0xvwx",
// 		amount: 200,
// 		date_created: "2024-06-15T23:55:45.417Z",
// 		sender: "0x0A1e4D0B5c71B955c0a5993023fc48bA6E380496",
// 		comment: "",
// 	},
// 	{
// 		txid: "0x252627",
// 		hypercert_id: "0xyz",
// 		amount: 250,
// 		date_created: "2024-07-20T12:34:56.789Z",
// 		sender: "0x4B0897b0513fdC7C2E18C307e4fC813a76a204Ae",
// 		comment: "Keep up the great work!",
// 	},
// 	{
// 		txid: "0x282930",
// 		hypercert_id: "0xabc1",
// 		amount: 175,
// 		date_created: "2024-08-05T08:30:00.123Z",
// 		sender: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
// 		comment: "Happy to help for a good cause.",
// 	},
// 	{
// 		txid: "0x313233",
// 		hypercert_id: "0xdef2",
// 		amount: 300,
// 		date_created: "2024-09-15T17:45:30.456Z",
// 		sender: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835CB2",
// 		comment: "Inspiring initiative, proud to support!",
// 	},
// ];

const transformDate = (timestamp: string) =>
	new Date(timestamp).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

const MobileFeed = ({ contributions }: { contributions: Contribution[] }) => {
	return (
		<ol
			className="flex flex-col gap-4 py-2 md:hidden"
			aria-labelledby="contributions-heading"
		>
			<h2 id="contributions-heading" className="sr-only">
				Contributions
			</h2>
			{contributions.map((contribution) => (
				<li
					key={`${contribution.sender}-${contribution.date_created}`}
					className="flex flex-col gap-2"
					aria-labelledby={`contribution-${contribution.txid}`}
				>
					<p className="text-xs uppercase text-vd-orange-700 bg-vd-beige-300 px-2 py-2 rounded-md font-medium">
						{transformDate(contribution.date_created)}
					</p>
					<div className="px-2">
						<div
							className="flex items-center"
							aria-label="Contributor and amount"
						>
							<p
								id={`contribution-${contribution.txid}`}
								className="text-sm font-semibold py-1 px-2 border-[1.5px] border-stone-300 bg-vd-beige-100 inline rounded-full text-stone-600"
							>
								{truncateEthereumAddress(
									contribution.sender,
								).toLocaleLowerCase() || "Anonymous"}
							</p>
							<span className="sr-only">contributed</span>
							<DotIcon aria-hidden="true" />
							<p className="font-semibold text-stone-500">
								{contribution.amount ? `$${contribution.amount}` : ""}
							</p>
						</div>
						{contribution.comment && (
							<div className="border-l-2 border-l-vd-blue-300 pl-2" role="note">
								<q className="py-2 text-vd-blue-700 text-sm">
									{contribution.comment}
								</q>
							</div>
						)}
					</div>
				</li>
			))}
		</ol>
	);
};

const DesktopFeed = ({ contributions }: { contributions: Contribution[] }) => {
	return (
		<ol
			className="border-l border-stone-300 dark:border-stone-500 hidden md:block"
			aria-label="Contributions list"
		>
			{contributions.map((contribution) => (
				<li
					key={`${contribution.sender}-${contribution.date_created}`}
					className="pt-3"
				>
					<div
						className="flex-start flex items-center"
						role="group"
						aria-labelledby="contributor-info"
					>
						<span
							className="-ml-[5px] mr-3 h-[9px] w-[9px] rounded-full bg-stone-300 dark:bg-stone-500"
							aria-hidden="true"
						/>
						<div className="flex items-center gap-2" id="contributor-info">
							<p className="text-sm font-semibold py-1 px-2 border-[1.5px] border-stone-300 bg-vd-beige-100 inline rounded-full text-stone-600">
								{truncateEthereumAddress(
									contribution.sender,
								).toLocaleLowerCase() || "Anonymous"}
							</p>
							<DotIcon className="text-stone-400" aria-hidden="true" />
							{contribution.amount && (
								<p
									className="font-semibold text-stone-500"
									aria-label={`Contribution amount: $${contribution.amount}`}
								>
									${contribution.amount}
								</p>
							)}
							<DotIcon className="text-stone-400" aria-hidden="true" />
							<p
								className="text-sm text-stone-500 dark:text-stone-300"
								aria-label={`Contribution date: ${transformDate(
									contribution.date_created,
								)}`}
							>
								{transformDate(contribution.date_created)}
							</p>
						</div>
					</div>
					{contribution.comment && (
						<div className="mb-6 ml-4 mt-2">
							<p
								className="mb-3 text-stone-500 dark:text-stone-300"
								role="article"
								aria-label="Contribution comment"
							>
								{contribution.comment}
							</p>
						</div>
					)}
				</li>
			))}
		</ol>
	);
};

const ReportSupportFeed = ({
	contributions,
}: { contributions: Contribution[] | [] }) => {
	const contributionsBySupportDate = contributions?.sort(
		(a, b) =>
			new Date(b.date_created).getTime() - new Date(a.date_created).getTime(),
	);

	const {
		currentPage,
		currentPageItems: pageContributions,
		loadPage,
		maxPage,
		pageNumbers,
		needsPagination,
	} = usePagination<Contribution>(contributionsBySupportDate, 8);

	if (!contributionsBySupportDate || !contributionsBySupportDate.length) {
		return (
			<section>
				<h3 className="text-2xl font-semibold py-4" id="support-feed-title">
					Support Feed
				</h3>
				<p className="text-stone-500 dark:text-stone-300">
					Nothing to show yet. Be the first to support this cause!
				</p>
			</section>
		);
	}

	return (
		<section>
			<h3 className="text-2xl font-semibold py-4">
				Support Feed
				<span className="text-base ml-2">
					({contributionsBySupportDate.length})
				</span>
			</h3>

			<section>
				<MobileFeed contributions={pageContributions} />
				<DesktopFeed contributions={pageContributions} />

				{/* Pagination */}
				{needsPagination && (
					<Pagination>
						<PaginationContent>
							<PaginationItem className="hover:cursor-pointer">
								<PaginationPrevious
									onClick={() =>
										currentPage > 1 ? loadPage(currentPage - 1) : null
									}
								/>
							</PaginationItem>
							{pageNumbers.map((pageNum, index) => (
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
							{maxPage > 4 && (
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
							)}
							<PaginationItem className="hover:cursor-pointer">
								<PaginationNext
									onClick={() =>
										currentPage < maxPage ? loadPage(currentPage + 1) : null
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				)}
			</section>
		</section>
	);
};

export default ReportSupportFeed;
