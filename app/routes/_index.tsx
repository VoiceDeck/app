import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import type { LucideIcon } from "lucide-react";
import {
	Circle,
	GlassWater,
	Heart,
	Lightbulb,
	MapPin,
	Salad,
	Search,
} from "lucide-react";
import { useMemo } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Progress } from "~/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import VoicedeckStats from "~/components/voicedeck-stats";
import { Report } from "~/types";
import { fetchReports } from "../impact-reports.server";

const iconComponents: { [key: string]: LucideIcon } = {
	Hunger: Salad,
	Thirst: GlassWater,
	Opportunity: Lightbulb,
	Dignity: Heart,
};

function GetIcon({
	category,
	color,
	strokeWidth,
	size,
}: {
	category: string;
	color: string;
	strokeWidth: string;
	size: string;
}) {
	const CategoryIcon = iconComponents[category];
	return <CategoryIcon color={color} strokeWidth={strokeWidth} size={size} />;
}

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
		return [...new Set(reports.map((report: Report) => report.category))];
	}, [reports]);
	// here using amounts directly from the HC, needs additional logic to group those amounts into displayed ranges ie $0-50, $50-100
	const uniqueFundedAmounts = useMemo(() => {
		return [...new Set(reports.map((report: Report) => report.fundedSoFar))];
	}, [reports]);
	// using id as placeholder for media outet name - not currently available on our example hypercerts
	const uniqueIds = useMemo(() => {
		return [...new Set(reports.map((report: Report) => report.id))];
	}, [reports]);
	const uniqueStates = useMemo(() => {
		return [...new Set(reports.map((report: Report) => report.state))];
	}, [reports]);
	return (
		<main className="flex flex-col gap-8 md:gap-6 justify-center items-center p-4 md:px-[14%]">
			<header className="flex-row bg-[url('/hero_imgLG.jpg')] bg-cover bg-center justify-start items-baseline text-vd-beige-200 rounded-3xl p-4 pt-24 md:pt-36 md:pr-48 md:pb-2 md:pl-8 max-w-screen-xl">
				<h1 className="text-6xl font-bold text-left">
					From individual actions to collective impact
				</h1>
				<h2 className="text-lg font-medium text-left py-6">
					We enable journalists to effect real change by bringing critical
					stories to light. Your contributions directly support this mission,
					sustaining journalism and bolstering investigative reporting that
					matters.
				</h2>
			</header>

			<section className="flex flex-col lg:flex-row w-full gap-3 lg:gap-3 max-w-screen-xl">
				<VoicedeckStats
					icon="blue_flower"
					heading="Total Supporters"
					data="104"
				/>
				<VoicedeckStats
					icon="blue_elephant"
					heading="Total Support Received"
					data="3.6K"
					currency="USD"
				/>
				<VoicedeckStats
					icon="blue_candle"
					heading="# of Reports Fully Funded"
					data="12"
				/>
			</section>

			<article className="w-full max-w-screen-xl">
				<h2 className="text-3xl md:text-4xl font-semibold pt-6">Reports</h2>
				<div className="flex flex-col md:flex-row md:justify-between md:items-end pb-8">
					<p className="text-base pb-4 md:pb-0 ">
						Find and fund reports that resonate with you.
					</p>
					<div className="flex flex-col md:flex-row gap-3">
						<Input type="search" placeholder="Search Reports" />
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
						<div className="border border-b-vd-blue-400 py-4">
							<h2 className="text-base font-medium pb-4">Categories</h2>
							{uniqueCategories.map((category) => (
								<div
									key={category as string}
									className="flex items-center gap-2 pb-1"
								>
									{GetIcon({
										category: category as string,
										color: "#E48F85",
										strokeWidth: "1.5",
										size: "26",
									})}
									<p className="text-sm">{category as string}</p>
								</div>
							))}
						</div>
						<div className="border border-b-vd-blue-400 pt-6 pb-4">
							<h2 className="text-base font-medium pb-4">Amount needed</h2>
							{uniqueFundedAmounts.map((fundedSoFar) => (
								<div
									key={fundedSoFar as number}
									className="flex items-center gap-2 pb-1"
								>
									<Circle size={18} strokeWidth={1} />
									<p className="text-sm">${1000 - (fundedSoFar as number)}</p>
								</div>
							))}
						</div>
						<div className="border border-b-vd-blue-400 pt-6 pb-4">
							<h2 className="text-base font-medium pb-4">Story from</h2>
							{uniqueIds.map((id) => (
								<div
									key={id as string}
									className="flex items-center gap-2 pb-1"
								>
									<Circle size={18} strokeWidth={1} />
									<p className="text-sm">{(id as string).slice(0, 15)}</p>
								</div>
							))}
						</div>
						<div className="border border-b-vd-blue-400 pt-6 pb-4">
							<h2 className="text-base font-medium pb-4">State</h2>
							{uniqueStates.map((state) => (
								<div
									key={state as string}
									className="flex items-center gap-2 pb-1"
								>
									<Circle size={18} strokeWidth={1} />
									<p className="text-sm">{state as string}</p>
								</div>
							))}
						</div>
						<div className="flex flex-col gap-5 pt-8 pb-4">
							<Button>Apply</Button>
							<Button variant={"outline"}>Clear all</Button>
						</div>
					</section>
					<section className="flex flex-wrap gap-5 md:gap-3">
						{reports.map((report: Report) => (
							<Card key={report.id}>
								<div className="h-[150px] overflow-hidden">
									<img
										src={report.image}
										alt="gpt-generated report illustration"
										className="object-none object-top rounded-3xl"
									/>
								</div>
								<CardHeader>
									<CardTitle>{report.title}</CardTitle>
									<CardDescription>{report.summary}</CardDescription>
								</CardHeader>
								<CardContent>
									<Badge>
										{GetIcon({
											category: report.category,
											color: "#C14E41",
											strokeWidth: "1",
											size: "14",
										})}
										<p>{report.category}</p>
									</Badge>
									<Badge>
										<MapPin color="#C14E41" strokeWidth={1} size={14} />
										<p>{report.state}</p>
									</Badge>
								</CardContent>
								<CardFooter>
									<Progress value={report.fundedSoFar / 10} />
									<p className="text-xs">
										${report.totalCost - report.fundedSoFar} still needed
									</p>
								</CardFooter>
							</Card>
						))}
						{/* mapping out our 2 reports again to see how they fit */}
						{reports.map((report: Report) => (
							<Card key={report.id}>
								<div className="h-[150px] overflow-hidden">
									<img
										src={report.image}
										alt="gpt-generated report illustration"
										className="object-none object-top rounded-3xl"
									/>
								</div>
								<CardHeader>
									<CardTitle>{report.title}</CardTitle>
									<CardDescription>{report.summary}</CardDescription>
								</CardHeader>
								<CardContent>
									<Badge>
										{GetIcon({
											category: report.category,
											color: "#C14E41",
											strokeWidth: "1",
											size: "14",
										})}
										<p>{report.category}</p>
									</Badge>
									<Badge>
										<MapPin color="#C14E41" strokeWidth={1} size={14} />
										<p>{report.state}</p>
									</Badge>
								</CardContent>
								<CardFooter>
									<Progress value={report.fundedSoFar / 10} />
									<p className="text-xs">
										${report.totalCost - report.fundedSoFar} still needed
									</p>
								</CardFooter>
							</Card>
						))}
					</section>
				</div>
			</article>
		</main>
	);
}
