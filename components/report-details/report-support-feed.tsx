"use client";
import { ShowingDisplay, VDPaginator } from "@/components/global/vd-paginator";

import { usePagination } from "@/hooks/use-pagination";
import { truncateEthereumAddress } from "@/lib/utils";
import type { Contribution } from "@/types";
import { DotIcon } from "lucide-react";

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
					<p className="rounded-md bg-vd-beige-300 px-2 py-2 font-medium text-vd-orange-700 text-xs uppercase">
						{transformDate(contribution.date_created)}
					</p>
					<div className="px-2">
						<div
							className="flex items-center"
							aria-label="Contributor and amount"
						>
							<p
								id={`contribution-${contribution.txid}`}
								className="inline rounded-full border-[1.5px] border-stone-300 bg-vd-beige-100 px-2 py-1 font-semibold text-sm text-stone-600"
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
								<q className="py-2 text-sm text-vd-blue-700">
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
			className="hidden border-stone-300 border-l md:block dark:border-stone-500"
			aria-label="Contributions list"
		>
			{contributions.map((contribution) => (
				<li
					key={`${contribution.sender}-${contribution.date_created}`}
					className="pt-3"
				>
					<div
						className="flex flex-start items-center"
						role="group"
						aria-labelledby="contributor-info"
					>
						<span
							className="-ml-[5px] mr-3 h-[9px] w-[9px] rounded-full bg-stone-300 dark:bg-stone-500"
							aria-hidden="true"
						/>
						<div className="flex items-center gap-2" id="contributor-info">
							<p className="inline rounded-full border-[1.5px] border-stone-300 bg-vd-beige-100 px-2 py-1 font-semibold text-sm text-stone-600">
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
						<div className="mt-2 mb-6 ml-4">
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

	const itemsPerPage = 8;

	const {
		currentPage,
		currentPageItems: pageContributions,
		loadPage,
		maxPage,
		needsPagination,
	} = usePagination<Contribution>(contributionsBySupportDate, itemsPerPage);

	if (!contributionsBySupportDate || !contributionsBySupportDate.length) {
		return (
			<section>
				<h3 className="py-4 font-semibold text-2xl" id="support-feed-title">
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
			<h3 className="py-4 font-semibold text-2xl">Support Feed</h3>
			<ShowingDisplay
				currentPage={currentPage}
				totalItemAmount={contributionsBySupportDate.length}
				itemsPerPage={itemsPerPage}
			/>

			<section className="pt-3">
				<MobileFeed contributions={pageContributions} />
				<DesktopFeed contributions={pageContributions} />

				{needsPagination && (
					<section className="flex flex-col items-center gap-2 pt-4">
						<VDPaginator
							needsPagination={needsPagination}
							currentPage={currentPage}
							maxPage={maxPage}
							loadPage={loadPage}
						/>
						<ShowingDisplay
							currentPage={currentPage}
							totalItemAmount={contributionsBySupportDate.length}
							itemsPerPage={itemsPerPage}
						/>
					</section>
				)}
			</section>
		</section>
	);
};

export default ReportSupportFeed;
