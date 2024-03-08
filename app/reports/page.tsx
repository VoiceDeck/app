import ConnectButton from "@/components/connect-button";
import { siteConfig } from "@/config/site";
import { getNumberOfContributors } from "@/lib/directus";
import { fetchReports } from "@/lib/impact-reports";
import { Report } from "@/types";

async function getData() {
  const reports = await fetchReports();
  const numContributors = await getNumberOfContributors();

  return { reports, numContributors };
}

export default async function Page() {
  const data = await getData();
  return (
    <main className="flex flex-col gap-6 md:gap-4 justify-center items-center p-4 md:px-[14%]">
      <header className="flex-row bg-[url('/hero_imgLG.jpg')] bg-cover bg-center justify-start items-baseline text-vd-beige-200 rounded-3xl p-4 pt-24 md:pt-36 md:pr-48 md:pb-2 md:pl-8 max-w-screen-xl">
        <h1 className="text-3xl md:text-6xl font-bold text-left">
          {siteConfig.title}
        </h1>
        <h2 className="text-lg font-medium text-left py-6">
          {siteConfig.description}
        </h2>
      </header>
      <ConnectButton />
      <h1>Reports</h1>
      <p>Number of contributors: {data.numContributors}</p>
      <ul>
        {data.reports.map((report: Report) => (
          <li key={report.slug}>
            <a href={`/reports/${report.slug}`}>{report.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
