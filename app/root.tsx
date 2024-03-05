import "@rainbow-me/rainbowkit/styles.css";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import {
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useLoaderData,
	useRouteError,
} from "@remix-run/react";

import { http, WagmiProvider } from "wagmi";

import { sepolia } from "wagmi/chains";

import "@fontsource-variable/plus-jakarta-sans";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNonce } from "~/lib/utils/nonce-provider";
import "./tailwind.css";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{
			title: data
				? "Intuition App Template - Remix"
				: "Error | Intuition App Template - Remix",
		},
		{ name: "description", content: "Start your Intuition journey." },
	];
};

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

export async function loader({ request }: LoaderFunctionArgs) {
	return json({
		ENV: {
			INFURA_API_KEY: process.env.INFURA_API_KEY,
			INFURA_SEPOLIA_RPC_URL: process.env.INFURA_SEPOLIA_RPC_URL,
			WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID,
		},
	});
}

function Document({
	children,
	title,
	nonce,
	env = {},
}: {
	children: React.ReactNode;
	title?: string;
	nonce?: string;
	theme?: string;
	env?: Record<string, string>;
}) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<title>{title}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

const queryClient = new QueryClient();

export default function App() {
	const { ENV } = useLoaderData<typeof loader>();
	const nonce = useNonce();

	const config = getDefaultConfig({
		appName: "VoiceDeck",
		projectId: ENV.WALLETCONNECT_PROJECT_ID || "",
		chains: [
			{
				...sepolia,
				rpcUrls: {
					default: {
						http: [
							ENV.INFURA_SEPOLIA_RPC_URL ?? sepolia.rpcUrls.default.http[0],
						],
					},
				},
			},
		],
		transports: {
			[sepolia.id]: http(),
		},
		ssr: true,
	});

	return (
		<Document nonce={nonce} env={ENV} title="VoiceDeck">
			<WagmiProvider config={config}>
				<QueryClientProvider client={queryClient}>
					<RainbowKitProvider initialChain={sepolia}>
						<Outlet />
					</RainbowKitProvider>
				</QueryClientProvider>
			</WagmiProvider>
		</Document>
	);
}
