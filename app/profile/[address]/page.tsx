import { Settings2 } from "lucide-react";
import Link from "next/link";

import { getContributionsByAddress } from "@/lib/directus";
import { fetchReportByHCId } from "@/lib/impact-reports";
import { cn, isNotNull } from "@/lib/utils";

import History, { type HistoryData } from "@/components/profile/history";
import { SideBar } from "@/components/profile/sidebar";
import { Summary } from "@/components/profile/summary";
import { buttonVariants } from "@/components/ui/button";

/**
 * Fetches contribution history data for a given address.
 * @param {string} address The blockchain address to fetch contributions for.
 * @returns {Promise<{history: HistoryData[], categoryCounts: Record<string, number>, totalAmount: number, reportCount: number}>} An object containing the contribution history and summary statistics.
 */
async function getContributionsHistoryData(address: `0x${string}`) {
	try {
		const contributions = await getContributionsByAddress(address);
		const historyPromises = contributions.map(
			async (contribution): Promise<HistoryData | null> => {
				const report = await fetchReportByHCId(contribution.hypercert_id);
				return {
					id: contribution.txid,
					date: new Date(contribution.date_created),
					amount: contribution.amount,
					img: {
						src: report.image,
						alt: report.title,
					},
					title: report.title,
					category: report.category,
					location: report.state,
					description: report.summary,
				};
			},
		);
		const historyResults = await Promise.all(historyPromises);
		const history = historyResults.filter(isNotNull);
		let totalAmount = 0;
		const categoryCounts: { [key: string]: number } = {};
		const reportCount = history.length;
		for (const entry of history) {
			totalAmount += entry.amount;
			categoryCounts[entry.category] =
				(categoryCounts[entry.category] || 0) + 1;
		}
		// Returning history, categoryCounts, and totalAmount directly
		return { history, categoryCounts, totalAmount, reportCount };
	} catch (error) {
		return {
			history: [],
			categoryCounts: {},
			totalAmount: 0,
			reportCount: 0,
		};
	}
}

export default async function ProfilePage({
	params: { address },
}: {
	params: { address: `0x${string}` };
}) {
	const {
		history = [],
		categoryCounts = {},
		totalAmount = 0,
		reportCount = 0,
	} = await getContributionsHistoryData(address);

	return (
		<main className="p-4 md:px-6 xl:px-0 md:py-8 md:max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 auto-rows-auto md:gap-4 gap-4 text-vd-blue-900 mb-6 max-w-6xl pb-16 md:pb-0">
			<header className="md:col-span-3 flex justify-between my-4">
				<h1 className="text-xl md:text-3xl font-semibold">My Hypercerts</h1>
				<Link
					href={`/profile/${address}/settings`}
					className={cn(buttonVariants({ variant: "link" }))}
				>
					Settings
					<Settings2 className="ml-2 h-4 w-4 mt-1" />
				</Link>
			</header>
			<Summary
				totalAmount={totalAmount}
				reportCount={reportCount}
				categoryCounts={categoryCounts}
			/>
			<SideBar />
			<History history={history} />
		</main>
	);
}
