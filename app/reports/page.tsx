import { ReportsView } from "@/components/reports/reports-view";
import VoicedeckStats from "@/components/reports/voicedeck-stats";
import { siteConfig } from "@/config/site";
import { FilterProvider } from "@/contexts/filter";
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
		<main className="flex flex-col gap-4 pb-[64px] md:pb-0">
			<section className="flex flex-col items-center p-4 md:p-8 gap-4">
				<header className="w-full flex flex-col justify-end bg-[url('/hero_img.webp')] bg-cover bg-center max-w-screen-xl min-[2560px]:max-w-screen-2xl h-[420px] 2xl:h-[520px] min-[2560px]:h-[720px] text-vd-beige-100 rounded-3xl p-4 md:p-8 2xl:p-16">
					<h1 className="text-3xl lg:text-5xl 2xl:text-7xl font-bold text-left max-w-screen-md 2xl:max-w-screen-lg">
						{siteConfig.title}
					</h1>
					<p className="text-lg 2xl:text-2xl font-medium text-left py-6 max-w-screen-md 2xl:max-w-screen-lg">
						{siteConfig.description}
					</p>
				</header>
				<VoicedeckStats
					numOfContributors={numOfContributors}
					reports={uniqueReports}
				/>
			</section>

			{uniqueReports.length ? (
				<FilterProvider>
					<ReportsView reports={uniqueReports} />
				</FilterProvider>
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
