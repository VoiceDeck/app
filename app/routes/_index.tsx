import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";
import { Report } from "~/types";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const response = await fetch(`${url.protocol}//${url.host}/impact-reports`);
	const data = await response.json();
	return json({ reports: data });
};

export const clientLoader = (args: ClientLoaderFunctionArgs) =>
	cacheClientLoader(args);

clientLoader.hydrate = true;

export default function Index() {
	const cacheData = useCachedLoaderData<typeof loader>();
	const reports = cacheData?.reports ?? [];
	// const { reports } = useLoaderData<typeof loader>();

	return (
		<div className="flex flex-col space-y-4">
			<h1 className="text-5xl font-bold">Reports</h1>

			<section>
				{reports.map((report: Report) => (
					<article key={report.id}>
						<img
							src={report.image}
							alt={report.title}
							className="h-36 w-auto"
						/>
						<h3 className="font-semibold text-lg">{report.title}</h3>
						<p>{report.summary}</p>
					</article>
				))}
			</section>
		</div>
	);
}
