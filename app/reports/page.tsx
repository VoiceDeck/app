import { ReportsView } from "@/components/reports/reports-view";
import { siteConfig } from "@/config/site";
import { getNumberOfContributors } from "@/lib/directus";
import { fetchReports } from "@/lib/impact-reports";
import type { Report } from "@/types";

export default async function ReportsPage() {
	let uniqueReports: Report[];
	let numOfContributors: number;
	try {
		const reports: Report[] = await fetchReports();
		uniqueReports = reports.reduce((acc, report) => {
			const reportExists = acc.find((r) => r.cmsId === report.cmsId);
			if (!reportExists) {
				acc.push(report);
			}
			return acc;
		}, [] as Report[]);
		numOfContributors = await getNumberOfContributors();
	} catch (error) {
		console.error("Failed to fetch reports:", error);
		throw new Error("Failed to fetch reports");
	}

	return (
		<main className="flex flex-col gap-6 md:gap-4 justify-center items-center p-2 pt-4 md:px-[14%]">
			<header className="flex-row bg-[url('/hero_img.jpg')] bg-cover bg-center justify-start items-baseline text-vd-beige-200 rounded-3xl p-4 pt-24 md:pt-36 md:pr-48 md:pb-2 md:pl-8 max-w-screen-xl">
				<h1 className="text-3xl md:text-6xl font-bold text-left">
					{siteConfig.title}
				</h1>
				<h2 className="text-lg font-medium text-left py-6">
					{siteConfig.description}
				</h2>
			</header>
			{uniqueReports.length ? (
				<ReportsView
					reports={uniqueReports}
					numOfContributors={numOfContributors}
				/>
			) : (
				<section className="flex flex-col items-center w-full pt-6 pb-24 md:pb-6">
					<img
						className="h-18 w-full md:w-96"
						src="/history-bg.svg"
						alt="circular pattern"
					/>
					<div className="text-vd-beige-600 text-xl font-bold text-center">
						<p>Sorry, something went wrong.</p>
						<p>Reports cannot be displayed right now.</p>
					</div>
				</section>
			)}
		</main>
	);
}
