import { graphql } from "gql.tada";
import request from "graphql-request";
import { Settings2 } from "lucide-react";
import Link from "next/link";

import { fetchReportByHCId } from "@/lib/impact-reports";
import { cn, isNotNull } from "@/lib/utils";

import History from "@/components/profile/fractions";
// TODO: Delete this
// import History, { type HistoryData } from "@/components/profile/history";
import { SideBar } from "@/components/profile/sidebar";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HYPERCERTS_API_URL } from "@/config/graphql";
import { HypercertClient } from "@hypercerts-org/sdk";
import type { Address } from "viem";
import { z } from "zod";

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

// TODO: Delete
// interface FractionPromise {
// 	fractionsCount: number;
// 	fractions: Fraction[];
// }

// TODO: Delete
interface Metadata {
	id: string;
	name: string;
	description: string;
	image: string;
	external_url: string;
	contributors: string[];
	work_scope: string[];
	work_timeframe_from: Date;
	work_timeframe_to: Date;
}

export interface Fraction {
	id: string;
	count: number;
	fraction_id: string;
	units: number;
	owner_address: Address;
	metadata: Metadata;
}

export interface Hypercert {
	id: string;
	hypercert_id: string;
	units: number;
	uri: string;
	creator_address: Address;
	contract: {
		chain_id: number;
	};
	metadata: Metadata;
}

const hypercertsByCreatorQuery = graphql(
	`
	  query GetHypercertsByCreator($address: String!) {
		hypercerts(
		  sort: { by: { claim_attestation_count: descending } }
		  where: { creator_address: { contains: $address } }
		  count: COUNT
		) {
		  count
		  data {
			hypercert_id
			units
			uri
			creator_address
			contract {
			  chain_id
			}
			metadata {
				id
				name
				description
				image
				external_url
				work_scope
				contributors
				work_timeframe_from
				work_timeframe_to
			}
		  }
		}
	  }
	`,
);

const getFractionsByOwnerQuery = graphql(
	`
		query GetFractionsByOwner($address: String!) {
			fractions(
				where: {owner_address: {contains: $address}}
				count: COUNT
			) {
				count
				data {
					id
					fraction_id
					owner_address
					units
					metadata {
						id
						name
						description
						image
						external_url
						work_scope
						contributors
						work_timeframe_from
						work_timeframe_to
					}
				}
			}
		}
		
	`,
);

const getFractionsByOwner = async (address: Address) => {
	const res = await request(HYPERCERTS_API_URL, getFractionsByOwnerQuery, {
		address: address,
	});
	const data = res;
	const fractionsData = data.fractions.data;
	const filteredFractions = fractionsData?.filter((fraction) => {
		if (fraction.metadata === null) {
			return { fractionsCount: 0, fractions: [] };
		}
		return fraction.metadata.name !== null && fraction.metadata.image !== null;
	});
	return {
		fractionsCount: filteredFractions?.length || 0,
		fractions: filteredFractions,
	};
};

const getHypercertsByCreator = async (address: Address) => {
	const res = await request(HYPERCERTS_API_URL, hypercertsByCreatorQuery, {
		address: address,
	});
	const data = res;
	const hypercertsData = data.hypercerts.data;
	const filteredHypercerts = hypercertsData?.filter((hypercert) => {
		if (hypercert.metadata === null) {
			return { hypercertsCount: 0, hypercerts: [] };
		}
		return (
			hypercert.metadata.name !== null && hypercert.metadata.image !== null
		);
	});
	return {
		hypercertsCount: filteredHypercerts?.length || 0,
		hypercerts: filteredHypercerts,
	};
};

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
	const { fractions, fractionsCount } = await getFractionsByOwner(address);
	const { hypercerts, hypercertsCount } = await getHypercertsByCreator(address);
	console.log("Hypercerts By Creator data:", hypercerts);
	console.log("Data in Page:", fractions);

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

			{/* // TODO: Move to separate component */}
			<section className="flex flex-col gap-4 md:col-span-2">
				<div className="flex flex-col gap-4 md:flex-row">
					<Card
						className={cn(
							"flex-1 rounded-3xl border-none bg-vd-blue-200 shadow-none",
						)}
					>
						<CardHeader>
							<CardTitle className={cn("font-normal text-sm")}>
								Hypercerts I've created
							</CardTitle>
						</CardHeader>
						<CardContent>
							<data className="font-bold text-4xl">{hypercertsCount}</data>
						</CardContent>
					</Card>
					<Card
						className={cn(
							"rounded-3xl border-none bg-vd-beige-300 shadow-none md:flex-1",
						)}
					>
						<CardHeader>
							<CardTitle className={cn("font-normal text-sm")}>
								# of Hypercerts I own
							</CardTitle>
						</CardHeader>
						<CardContent>
							<data className="font-bold text-4xl">{fractionsCount}</data>
						</CardContent>
					</Card>
				</div>
			</section>
			{/* <Summary
				totalAmount={totalAmount}
				reportCount={reportCount}
				categoryCounts={categoryCounts}
			/> */}
			<SideBar />
			{/* <History history={history} /> */}
			{/* // TODO: Fix type error */}
			<History
				hypercerts={hypercerts as Hypercert[]}
				fractions={fractions as Fraction[]}
			/>
		</main>
	);
}
