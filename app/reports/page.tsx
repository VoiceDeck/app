import { getNumberOfContributors } from "@/lib/directus"
import { fetchReports } from "@/lib/impact-reports";
import { Report } from "@/types"

async function getData() {
  const reports = await fetchReports();
  const numContributors = await getNumberOfContributors()

  return { reports, numContributors }
}

export default async function Page() {
  const data = await getData()
  return <main>
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
}