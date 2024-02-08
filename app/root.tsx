import {
	Link,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useRouteError,
} from "@remix-run/react";

import "@fontsource-variable/plus-jakarta-sans";
import { ReactNode } from "react";
import { Footer } from "~/components/global/footer";
import { NavMenu } from "~/components/global/nav-menu";
import "./tailwind.css";

export default function App() {
	return (
		<Document>
			<NavMenu />
			<Outlet />
			<Footer />
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
			<body className="bg-vd-beige-200">
				{props.children}
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
