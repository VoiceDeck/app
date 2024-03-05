import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import { Settings2 } from "lucide-react";

import { cn } from "~/lib/utils";

import History, { HistoryData } from "~/components/my-actions/history";
import { SideBar } from "~/components/my-actions/sidebar";
import { Summary } from "~/components/my-actions/summary";
import { buttonVariants } from "~/components/ui/button";

import { useAccount } from "wagmi";
import { getContributionsByAddress } from "~/directus.server";
import { fetchReportByHCId } from "~/impact-reports.server";

export const loader: LoaderFunction = async ({
	request,
}: LoaderFunctionArgs) => {
	const testAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cfffb92266";

	try {
		const contributions = await getContributionsByAddress(testAddress);
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
		console.error(
			`Failed to load reports contributed by ${testAddress}: ${error}`,
		);
		return [];
	}
};

function Actions() {
	const { history } = useLoaderData<typeof loader>();
	const { address } = useAccount();

	return (
		<main className="container grid grid-cols-1 md:grid-cols-3 auto-rows-auto md:gap-4 gap-4 text-vd-blue-900 mb-6">
			<header className="md:col-span-3 flex justify-between my-4">
				<h1 className="text-xl md:text-3xl font-semibold">My Actions</h1>
				<NavLink
					to={`/profile/${address}/settings`}
					className={cn(buttonVariants({ variant: "link" }))}
				>
					Settings
					<Settings2 className="ml-2 h-4 w-4 mt-1" />
				</NavLink>
			</header>
			<Summary />
			<SideBar />
			<History history={history} />
		</main>
	);
}

export default Actions;
