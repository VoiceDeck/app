import { Settings2 } from "lucide-react";
import Link from "next/link";

import { getContributionsByAddress } from "@/lib/directus";
import { fetchReportByHCId } from "@/lib/impact-reports";
import { cn, isNotNull } from "@/lib/utils";

import History, { type HistoryData } from "@/components/profile/history";
import { SideBar } from "@/components/profile/sidebar";
import { Summary } from "@/components/profile/summary";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { SellFractionsDialogContent } from "@/components/profile/sell-fractions-dialog-content";
import type { Address } from "viem";

/**
 * Fetches contribution history data for a given address.
 * @param {string} address The blockchain address to fetch contributions for.
 * @returns {Promise<{history: HistoryData[], categoryCounts: Record<string, number>, totalAmount: number, reportCount: number}>} An object containing the contribution history and summary statistics.
 */
// async function getContributionsHistoryData(address: `0x${string}`) {
// 	try {
// 		const contributions = await getContributionsByAddress(address);
// 		const historyPromises = contributions.map(
// 			async (contribution): Promise<HistoryData | null> => {
// 				const report = await fetchReportByHCId(contribution.hypercert_id);
// 				return {
// 					id: contribution.txid,
// 					date: new Date(contribution.date_created),
// 					amount: contribution.amount,
// 					img: {
// 						src: report.image,
// 						alt: report.title,
// 					},
// 					title: report.title,
// 					category: report.category,
// 					location: report.state,
// 					description: report.summary,
// 				};
// 			},
// 		);
// 		const historyResults = await Promise.all(historyPromises);
// 		const history = historyResults.filter(isNotNull);
// 		let totalAmount = 0;
// 		const categoryCounts: { [key: string]: number } = {};
// 		const reportCount = history.length;
// 		for (const entry of history) {
// 			totalAmount += entry.amount;
// 			categoryCounts[entry.category] =
// 				(categoryCounts[entry.category] || 0) + 1;
// 		}
// 		// Returning history, categoryCounts, and totalAmount directly
// 		return { history, categoryCounts, totalAmount, reportCount };
// 	} catch (error) {
// 		return {
// 			history: [],
// 			categoryCounts: {},
// 			totalAmount: 0,
// 			reportCount: 0,
// 		};
// 	}
// }
async function getHypercertFractionsByOwner(address: Address) {
	console.log("Address:", address);
	try {
		const res = await fetch("https://api.hypercerts.org/v1/graphql", {
			cache: "no-store",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: `
					query GetFractionsByOwner($address: String!) {
						fractions(
							where: {owner_address: {contains: $address}}
							count: COUNT
						) {
							count
							data {
							metadata {
								id
								name
							}
							}
						}
					}
				`,
				variables: {
					address: address,
				},
			}),
		});
		if (!res.ok) {
			throw new Error("Network response was not ok.");
		}
		const data = await res.json();
		console.log("Data:", data);
		return data;
	} catch (error) {
		console.error("Error:", error);
		throw error;
	}
}

export default async function ProfilePage({
	params: { address },
}: {
	params: { address: Address };
}) {
	// const {
	// 	history = [],
	// 	categoryCounts = {},
	// 	totalAmount = 0,
	// 	reportCount = 0,
	// } = await getContributionsHistoryData(address);
	const data = await getHypercertFractionsByOwner(
		"0xA8cadC2268B01395f8573682fb9DD00Bd582E8A0",
	);
	console.log("Data:", data);

	return (
		<main className="mx-auto mb-6 grid max-w-6xl auto-rows-auto grid-cols-1 gap-4 p-4 pb-16 text-vd-blue-900 md:max-w-[1200px] md:grid-cols-3 md:px-6 xl:px-0 md:py-8 md:pb-0">
			<header className="my-4 flex justify-between md:col-span-3">
				<h1 className="font-semibold text-xl md:text-3xl">My Hypercerts</h1>
				<Link
					href={`/profile/${address}/settings`}
					className={cn(buttonVariants({ variant: "link" }))}
				>
					Settings
					<Settings2 className="mt-1 ml-2 h-4 w-4" />
				</Link>
			</header>
			{/* <Summary
				totalAmount={totalAmount}
				reportCount={reportCount}
				categoryCounts={categoryCounts}
			/> */}
			<SideBar />
			{/* <History history={history} /> */}
			<Dialog>
				<DialogTrigger asChild>
					<Button size={"lg"} variant={"default"}>
						List for sale
					</Button>
				</DialogTrigger>
				<SellFractionsDialogContent />
			</Dialog>
		</main>
	);
}
