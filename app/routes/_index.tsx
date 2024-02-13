import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, json, useLoaderData } from "@remix-run/react";
import { Circle, Filter } from "lucide-react";
import { useMemo } from "react";
import DynamicCategoryIcon from "~/components/dynamic-category-icon";
import ReportCard from "~/components/report-card";
import { Button } from "~/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "~/components/ui/drawer";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import VoicedeckStats from "~/components/voicedeck-stats";
import { siteConfig } from "~/config/site";
import { Report } from "~/types";
import { fetchReports } from "../impact-reports.server";

export const meta: MetaFunction = () => {
	return [
		{ title: "VoiceDeck" },
		{ name: "description", content: "Welcome to VoiceDeck!" },
	];
};

export const loader: LoaderFunction = async () => {
	const ownerAddress = process.env.HC_OWNER_ADDRESS;
	if (!ownerAddress)
		throw new Error("Owner address environment variable is not set");
	try {
		const response = await fetchReports(ownerAddress);
		return json(response);
	} catch (error) {
		console.error(`Failed to load impact reports: ${error}`);
		throw new Response("Failed to load impact reports", { status: 500 });
	}
};

export default function Index() {
	const reports = useLoaderData<typeof loader>();
	const uniqueCategories = useMemo(() => {
		return reports
			.map((report: Report, index: number) => report.category || null)
			.filter(
				(value: string, index: number, self: string[]) =>
					self.indexOf(value) === index,
			);
	}, [reports]);

	const calculateFunding = useMemo(() => {
		const allAmounts = reports.map(
			(report: Report, index: number) => report.fundedSoFar || 0,
		);
		const sumOfAmounts = allAmounts.reduce((a: number, b: number) => a + b, 0);
		const fullyFunded = allAmounts.filter((amount: number) => amount === 1000);
		const amountNeededFilters: string[] = [];
		for (let i = 0; i < allAmounts.length; i++) {
			if (1000 - allAmounts[i] < 51) {
				amountNeededFilters.push("$0 - 50");
			} else if (1000 - allAmounts[i] < 201) {
				amountNeededFilters.push("$50 - 200");
			} else if (1000 - allAmounts[i] < 501) {
				amountNeededFilters.push("$200 - 500");
			} else {
				amountNeededFilters.push("$500+");
			}
		}
		const uniqueAmountFilters = amountNeededFilters.filter(
			(value: string, index: number, self: string[]) =>
				self.indexOf(value) === index,
		);
		return {
			amounts: allAmounts,
			filters: uniqueAmountFilters,
			sum: sumOfAmounts,
			numFunded: fullyFunded.length || 0,
		};
	}, [reports]);

	// here using amounts directly from the HC, needs additional logic to group those amounts into displayed ranges ie $0-50, $50-100
	// const uniqueFundedAmounts = useMemo(() => {
	// 	return calculateFunding.amounts
	// 		// .map((report: Report, index: number) => report.fundedSoFar || null)
	// 		.filter(
	// 			(value: number, index: number, self: number[]) =>
	// 				self.indexOf(value) === index,
	// 		);
	// }, [calculateFunding]);

	const uniqueMediaOutlets = useMemo(() => {
		return reports
			.map((report: Report, index: number) => report.contributors[0] || null)
			.filter(
				(value: string, index: number, self: string[]) =>
					self.indexOf(value) === index,
			);
	}, [reports]);

	const uniqueStates = useMemo(() => {
		return reports
			.map((report: Report, index: number) => report.state || null)
			.filter(
				(value: string, index: number, self: string[]) =>
					self.indexOf(value) === index,
			);
	}, [reports]);

	return (
		<main className="flex flex-col gap-6 md:gap-4 justify-center items-center p-4 md:px-[14%]">
			<header className="flex-row bg-[url('/hero_imgLG.jpg')] bg-cover bg-center justify-start items-baseline text-vd-beige-200 rounded-3xl p-4 pt-24 md:pt-36 md:pr-48 md:pb-2 md:pl-8 max-w-screen-xl">
				<h1 className="text-6xl font-bold text-left">{siteConfig.title}</h1>
				<h2 className="text-lg font-medium text-left py-6">
					{siteConfig.description}
				</h2>
			</header>

			<section className="flex flex-col lg:flex-row w-full gap-3 max-w-screen-xl">
				<VoicedeckStats
					key="flower"
					icon="flower"
					heading="Total Supporters"
					data={104}
				/>
				<VoicedeckStats
					key="elephant"
					icon="elephant"
					heading="Total Support Received"
					data={calculateFunding.sum}
					currency="USD"
				/>
				<VoicedeckStats
					key="candle"
					icon="candle"
					heading="# of Reports Fully Funded"
					data={calculateFunding.numFunded}
				/>
			</section>

			<article className="w-full max-w-screen-xl">
				<h2 className="text-3xl md:text-4xl font-semibold pt-6 md:pt-10">
					Reports
				</h2>
				<div className="flex flex-col md:flex-row md:justify-between md:items-end pb-8">
					<p className="text-base pb-4 md:pb-0 ">
						Find and fund reports that resonate with you.
					</p>
					<div className="flex flex-col md:flex-row gap-3">
						<Input
							className="h-10 border-vd-blue-500 bg-vd-beige-100 py-2 text-base font-medium placeholder:text-vd-blue-500 ring-offset-white focus-visible:ring-offset-2 focus-visible:ring-vd-blue-500 focus-visible:ring-2"
							type="search"
							placeholder="Search Reports"
						/>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="amount-needed">Amount Needed</SelectItem>
								<SelectItem value="newest-oldest">Newest to Oldest</SelectItem>
								<SelectItem value="oldest-newest">Oldest to Newest</SelectItem>
								<SelectItem value="most-contributors">
									Most Contributors
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex flex-col md:flex-row gap-10 pb-16">
					<section>
						<div className="md:hidden">
							<Drawer>
								<DrawerTrigger className="flex h-9 w-full rounded-md border-input justify-between items-center bg-vd-blue-100 border border-vd-blue-500 px-3 py-2">
									<p className="text-base font-medium text-vd-blue-500">
										Filter
									</p>
									<Filter color="#3A5264" size={18} />
								</DrawerTrigger>
								<DrawerContent className="gap-10">
									<DrawerFooter>
										<DrawerClose>
											<Button variant="ghost" size="icon">
												<div className="flex flex-col justify-center items-center">
													<span className="text-xs">Close</span>
												</div>
											</Button>
										</DrawerClose>
									</DrawerFooter>
								</DrawerContent>
							</Drawer>
						</div>
						<div className="border border-b-vd-blue-400 py-4">
							<h2 className="text-base font-medium pb-4">Categories</h2>
							{uniqueCategories.map((category: string) => (
								<div key={category} className="flex items-center gap-2 pb-1">
									<DynamicCategoryIcon category={category} />
									<p className="text-sm">{category}</p>
								</div>
							))}
						</div>
						<div className="border border-b-vd-blue-400 pt-6 pb-4">
							<h2 className="text-base font-medium pb-4">Amount needed</h2>

							{calculateFunding.filters.map((range: string) => (
								<div key={range} className="flex items-center gap-2 pb-1">
									<Circle size={18} strokeWidth={1} />
									<p className="text-xs">{range}</p>
								</div>
							))}
						</div>
						<div className="border border-b-vd-blue-400 pt-6 pb-4">
							<h2 className="text-base font-medium pb-4">Story from</h2>
							{uniqueMediaOutlets.map((outlet: string) => (
								<div key={outlet} className="flex items-center gap-2 pb-1">
									<Circle size={18} strokeWidth={1} />
									<p className="text-xs">{outlet}</p>
								</div>
							))}
						</div>
						<div className="border border-b-vd-blue-400 pt-6 pb-4">
							<h2 className="text-base font-medium pb-4">State</h2>
							{uniqueStates.map((state: string) => (
								<div key={state} className="flex items-center gap-2 pb-1">
									<Circle size={18} strokeWidth={1} />
									<p className="text-xs">{state}</p>
								</div>
							))}
						</div>
						<div className="flex flex-col gap-5 pt-8 pb-4">
							<Button>Apply</Button>
							<Button variant={"outline"}>Clear all</Button>
						</div>
					</section>

					<section className="grid grid-rows-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 md:gap-3">
						{reports.map((report: Report) => (
							<Link to={`/reports/${report.slug}`} key={report.hypercertId}>
								<ReportCard
									hypercertId={report.hypercertId}
									image={report.image}
									title={report.title}
									summary={report.summary}
									category={report.category}
									state={report.state}
									totalCost={report.totalCost}
									fundedSoFar={report.fundedSoFar}
								/>
							</Link>
						))}
					</section>
				</div>
			</article>
		</main>
	);
}
