import "@fontsource-variable/plus-jakarta-sans";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
	Link,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	json,
	useRouteError,
	useRouteLoaderData,
} from "@remix-run/react";
import { ReactNode } from "react";
import { fetchReports } from "~/server/impactReportHelpers";
import "./tailwind.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const ownerAddress = process.env.HC_OWNER_ADDRESS;
	try {
		if (!ownerAddress) {
			throw new Error("Owner address environment variable is not set");
		}
		const reports = await fetchReports(ownerAddress);
		// remix shortcut to return json instead of a string
		return json(reports);
		// return new Response((reports), {
		// 	status: 200,
		// 	statusText: "OK",
		// });
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

// custom hook to pass the loader's type to other routes
export function useRootLoaderData() {
	return useRouteLoaderData<typeof loader>("root");
}

export default function App() {
	return (
		<Document>
			<Outlet />
		</Document>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();
	if (isRouteErrorResponse(error)) {
		return (
			<Document title={error.statusText}>
				<section className="w-full h-svh bg-red-100 text-red-600">
					<h1 className="text-3xl">Oops!</h1>
					<p>There was an error:</p>
					<pre>
						{error.status} {error.statusText || error.data}
					</pre>
					<Link to="/">Go home</Link>
				</section>
			</Document>
		);
	}
	if (error instanceof Error) {
		return (
			<div>
				<h1>Error</h1>
				<p>{error.message}</p>
				<p>The stack trace is:</p>
				<pre>{error.stack}</pre>
			</div>
		);
	}
	return <h1>Unknown Error</h1>;
}

function Document(props: { children: ReactNode; title?: string }) {
	return (
		<html lang="en">
			<head>
				{props.title ? <title>{props.title}</title> : null}
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{props.children}
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
