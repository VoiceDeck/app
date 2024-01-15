import type { LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import Markdown from "react-markdown";

export interface ReportSchema {
	id: string;
	status: string;
	date_created: string;
	title: string;
	content: string;
	slug: string;
}

export const meta: MetaFunction = ({ data }: MetaArgs) => {
	const report = data as ReportSchema;
	return [{ title: `VoiceDeck | ${report.title}` }];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const slug = params.slug;
	if (!slug) {
		throw new Response("We couldn't find that report", { status: 400 });
	}
	try {
		const response = await fetch(
			`${process.env.API_BASE_URL}/items/reports?filter[slug][_eq]=${slug}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.API_ACCESS_TOKEN}`,
				},
			},
		);
		const json = await response.json();
		console.log(json);
		if (json.data.length === 0) {
			throw new Response("We couldn't find that report", { status: 400 });
		}
		return json.data[0];
	} catch (error) {
		console.error(error);
		throw new Response("Failed to load report", {
			status: 400,
			statusText: "We couldn't find that report",
		});
	}
};

export default function RouteComponent() {
	const loaderResponse = useLoaderData<typeof loader>();
	const report = loaderResponse as ReportSchema;

	return (
		<article>
			<h1 className="text-3xl font-bold">{report.title}</h1>
			<Markdown className="prose">{report.content}</Markdown>
		</article>
	);
}
