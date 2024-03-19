import { Settings2 } from "lucide-react";
import Link from "next/link";

import { getContributionsByAddress } from "@/lib/directus";
import { fetchReportByHCId } from "@/lib/impact-reports";
import { cn } from "@/lib/utils";

import History, { type HistoryData } from "@/components/profile/history";
import { SideBar } from "@/components/profile/sidebar";
import { Summary } from "@/components/profile/summary";
import { buttonVariants } from "@/components/ui/button";

async function getContributionsHistoryData(address: `0x${string}`) {
	try {
		const contributions = await getContributionsByAddress(address);
		const historyPromises = contributions.map(async (contribution) => {
			const report = await fetchReportByHCId(contribution.hypercert_id);
			return {
				id: contribution.txid,
				date: contribution.date_created
					? new Date(contribution.date_created)
					: undefined,
				amount: contribution.amount,
				img: {
					src: report.image,
					alt: report.title,
				},
				title: report.title,
				category: report.category,
				location: report.state,
				description: report.summary,
			} as HistoryData;
		});

		const history = await Promise.all(historyPromises);
		let totalAmount = 0;
		let reportCount = 0;
		const categoryCounts: { [key: string]: number } = {}; // Object to hold category counts

		for (const entry of history) {
			totalAmount += entry.amount;
			reportCount += 1;

			if (categoryCounts[entry.category]) {
				categoryCounts[entry.category] += 1;
			} else {
				categoryCounts[entry.category] = 1;
			}
		}

		// Returning history, categoryCounts, and totalAmount directly
		return { history, categoryCounts, totalAmount, reportCount };
	} catch (error) {
		console.error(`Failed to load reports contributed by ${address}: ${error}`);
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
		<main className="container grid grid-cols-1 md:grid-cols-3 auto-rows-auto md:gap-4 gap-4 text-vd-blue-900 mb-6 max-w-6xl pb-16 md:pb-0">
			<header className="md:col-span-3 flex justify-between my-4">
				<h1 className="text-xl md:text-3xl font-semibold">My Actions</h1>
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
			<History history={history || []} />
		</main>
	);
}
