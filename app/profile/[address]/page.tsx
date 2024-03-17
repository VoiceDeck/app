import { Settings2 } from "lucide-react";
import Link from "next/link";

import { getContributionsByAddress } from "@/lib/directus";
import { fetchReportByHCId } from "@/lib/impact-reports";
import { cn } from "@/lib/utils";

import History, { type HistoryData } from "@/components/my-actions/history";
import { SideBar } from "@/components/my-actions/sidebar";
import { Summary } from "@/components/my-actions/summary";
import { buttonVariants } from "@/components/ui/button";

async function getContributionsHistoryData(address: `0x${string}`) {
	// The return value is *not* serialized
	// You can return Date, Map, Set, etc.
	try {
		const contributions = await getContributionsByAddress(address);
		const historyPromises = contributions.map(async (contribution) => {
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
			} as HistoryData;
		});

		const history = await Promise.all(historyPromises);
		return history;
	} catch (error) {
		console.error(`Failed to load reports contributed by ${address}: ${error}`);
		return [];
	}
}

export default async function ProfilePage({
	params: { address },
}: {
	params: { address: `0x${string}` };
}) {
	const history = await getContributionsHistoryData(address);

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
			<Summary />
			<SideBar />
			<History history={history || []} />
		</main>
	);
}
