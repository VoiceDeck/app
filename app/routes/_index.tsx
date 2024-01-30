import type { MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { fetchReports } from "~/server/impactReportHelpers";
import { Report } from "~/types";

export const meta: MetaFunction = () => {
	return [
		{ title: "VoiceDeck" },
		{ name: "description", content: "Welcome to VoiceDeck!" },
	];
};

export const loader = async () => {
	const ownerAddress = process.env.HC_OWNER_ADDRESS;
	try {
		if (!ownerAddress) {
			throw new Error("Owner address environment variable is not set");
		}
		const response = await fetchReports(ownerAddress);
		return json(response);
	} catch (error) {
		console.error(`Failed to load impact reports: ${error}`);
		return new Response(
			JSON.stringify({ error: "Failed to load impact reports" }),
			{
				status: 500,
				statusText: "Internal Server Error",
			},
		);
	}
};

export default function Index() {
	const reports = useLoaderData<typeof loader>();
	return (
		<main className="flex flex-col gap-8 md:gap-10 justify-center items-center p-4 md:px-[15%]">
			<header className="flex-row bg-[url('/hero_img.jpg')] bg-cover bg-center justify-start items-baseline text-vd-beige-200 rounded-3xl p-6 pt-44 md:pt-80 md:pr-48 md:pb-10 md:pl-16 max-w-[1372px]">
				<h1 className="text-6xl md:text-7xl font-bold text-left">
					From Individual Actions to Collective Impact
				</h1>
				<h2 className="text-xl font-medium text-left py-6">
					We enable journalists to effect real change by bringing critical
					stories to light. Your contributions directly support this mission,
					sustaining journalism and bolstering investigative reporting that
					matters.
				</h2>
			</header>

			<section className="flex flex-col lg:flex-row w-full gap-3 lg:gap-5 max-w-[1372px]">
				<div className="flex flex-auto gap-8 lg:w-[33%] rounded-3xl bg-vd-blue-200 p-4">
					<img src={"/blue_flower.svg"} alt="blue flower drawing" />
					<div className="flex flex-col gap-4">
						<p className="text-xl font-medium">Total Supporters</p>
						<p className="text-4xl md:text-5xl font-bold">104</p>
					</div>
				</div>
				<div className="flex flex-auto gap-8 lg:w-[33%] rounded-3xl bg-vd-blue-200 p-4">
					<img src={"/blue_elephant.svg"} alt="blue elephant drawing" />
					<div className="flex flex-col gap-4">
						<p className="text-xl font-medium">Total Support Received</p>
						<p className="text-4xl md:text-5xl font-bold">
							3.6K <span className="text-xl">USD</span>
						</p>
					</div>
				</div>
				<div className="flex flex-auto gap-8 lg:w-[33%] rounded-3xl bg-vd-blue-200 p-4">
					<img src={"/blue_candle.svg"} alt="blue candle drawing" />
					<div className="flex flex-col gap-4">
						<p className="text-xl font-medium"># of Reports Fully Funded</p>
						<p className="text-4xl md:text-5xl font-bold">12</p>
					</div>
				</div>
			</section>

			<article className="max-w-[1372px]">
				<h2 className="text-4xl md:text-5xl font-bold pt-12 md:pt-16 pb-3">
					Reports
				</h2>
				<div className="flex flex-col md:flex-row md:justify-between md:items-end pb-12">
					<p className="text-xl font-400">
						Find and fund reports that resonate with you.
					</p>
					<div className="flex flex-col md:flex-row gap-3">
						{/* <Input
							type="search"
							placeholder="Search Reports"
							className="text-base bg-vd-beige-100 border-vd-blue-200 placeholder:text-vd-blue-400"
						/> */}
						{/* <Select>
							<SelectTrigger className="w-[380px] text-base bg-vd-blue-100 text-vd-blue-700">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent className="bg-vd-blue-100 text-vd-blue-700">
								<SelectItem value="amount-needed">Amount Needed</SelectItem>
								<SelectItem value="newest-oldest">Newest to Oldest</SelectItem>
								<SelectItem value="oldest-newest">Oldest to Newest</SelectItem>
								<SelectItem value="most-contributors">
									Most Contributors
								</SelectItem>
							</SelectContent>
						</Select> */}
					</div>
				</div>

				<div className="flex flex-wrap gap-5 w-full">
					{reports.map((report: Report) => (
						<section key={report.id}>
							<div>ID: {report.id}</div>
							<div>TTILE: {report.title}</div>
							<div>SUMMARY: {report.summary}</div>
							<div>IMAGE: {report.image.slice(0, 50)}</div>
							<div>STATE: {report.state}</div>
							<div>CATEGORY: {report.category}</div>
							<div>TOTAL COST: {report.totalCost}</div>
							<div>FUNDED SO FAR: {report.fundedSoFar}</div>
						</section>
					))}
				</div>
			</article>
		</main>
	);
}
