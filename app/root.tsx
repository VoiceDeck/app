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

import {
	WagmiConfig,
	configureChains,
	createConfig,
	mainnet,
	sepolia,
} from "wagmi";

import "@fontsource-variable/plus-jakarta-sans";
import {
	RainbowKitProvider,
	getDefaultWallets,
	lightTheme,
} from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
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

export default function App() {
	const { ENV } = useLoaderData<typeof loader>();
	const nonce = useNonce();

	const [{ config, chains }] = useState(() => {
		const { chains, publicClient, webSocketPublicClient } = configureChains(
			[sepolia, mainnet],
			[
				jsonRpcProvider({
					rpc: () => {
						if (!ENV.INFURA_SEPOLIA_RPC_URL) {
							throw new Error("INFURA_RPC_URL is not defined");
						}
						return { http: ENV.INFURA_SEPOLIA_RPC_URL };
					},
				}),
			],
		);

		const { connectors } = getDefaultWallets({
			appName: "Voicedeck",
			chains,
			projectId: ENV.WALLETCONNECT_PROJECT_ID || "",
		});

		const config = createConfig({
			autoConnect: true,
			connectors,
			publicClient,
			webSocketPublicClient,
		});

		return {
			config,
			chains,
		};
	});

	return (
		<Document nonce={nonce} env={ENV} title="VoiceDeck">
			{config && chains ? (
				<>
					<WagmiConfig config={config}>
						<RainbowKitProvider
							chains={chains}
							modalSize="compact"
							theme={lightTheme()}
						>
							<Outlet />
						</RainbowKitProvider>
					</WagmiConfig>
				</>
			) : null}
		</Document>
	);
}
