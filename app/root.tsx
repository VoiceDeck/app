import "@fontsource-variable/plus-jakarta-sans";
import {
	RainbowKitProvider,
	Theme,
	darkTheme,
	getDefaultConfig,
	lightTheme,
} from "@rainbow-me/rainbowkit";
import {
	metaMaskWallet,
	rabbyWallet,
	rainbowWallet,
	zerionWallet,
} from "@rainbow-me/rainbowkit/wallets";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	json,
	useLoaderData,
	useRouteError,
} from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link } from "lucide-react";
import { http, WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";

import "@rainbow-me/rainbowkit/styles.css";
import "vaul/dist/index.css";
import { Footer } from "./components/global/footer";
import { NavMenu } from "./components/global/nav-menu";
import "./tailwind.css";

import _ from "lodash";

const customRainbowTheme: Theme = _.merge(lightTheme(), {
	fonts: {
		body: "Plus Jakarta Sans, sans-serif",
	},
	colors: {
		accentColor: "#C14E41",
		modalText: "#252F56",
		modalTextDim: "#6B6B6B",
		modalTextSecondary: "#42424A",
		actionButtonSecondaryBackground: "#C14E41",
	},
	blurs: {
		modalOverlay: "medium",
	},
});

export async function loader() {
	// IMPORTANT: This seems like a security risk, not sure I want to expose env variables to frontend
	return json({
		ENV: {
			INFURA_API_KEY: process.env.INFURA_API_KEY,
			WALLET_CONNECT_ID: process.env.WALLET_CONNECT_ID,
		},
	});
}

export function ErrorBoundary() {
	const error = useRouteError();
	if (isRouteErrorResponse(error)) {
		return (
			<Layout title={error.statusText}>
				<section className="w-full h-svh bg-red-100 text-red-600">
					<h1 className="text-3xl">Oops!</h1>
					<p>There was an error:</p>
					<pre>
						{error.status} {error.statusText || error.data}
					</pre>
					<Link to="/">Go home</Link>
				</section>
			</Layout>
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

function Layout({
	children,
	title,
	env,
}: {
	children: React.ReactNode;
	title: string;
	env?: { INFURA_API_KEY: string; WALLET_CONNECT_ID: string };
}) {
	return (
		<html lang="en" className="scroll-smooth">
			<head>
				{title && <title>{title}</title>}
				<meta charSet="utf-8" />
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

type LoaderData = {
	ENV: {
		INFURA_API_KEY: string;
		WALLET_CONNECT_ID: string;
	};
};

export default function App() {
	const { ENV } = useLoaderData<LoaderData>();

	const config = getDefaultConfig({
		ssr: true,
		appName: "VoiceDeck",
		projectId: ENV.WALLET_CONNECT_ID,
		chains: [sepolia],
		wallets: [
			{
				groupName: "Recommended",
				wallets: [rainbowWallet, zerionWallet, rabbyWallet, metaMaskWallet],
			},
		],
		transports: {
			// [mainnet.id]: http(`https://mainnet.infura.io/v3/${ENV.INFURA_API_KEY}`),
			[sepolia.id]: http(`https://sepolia.infura.io/v3/${ENV.INFURA_API_KEY}`),
		},
	});

	return (
		<Layout title="VoiceDeck" env={ENV}>
			{config && (
				<WagmiProvider config={config}>
					<QueryClientProvider client={queryClient}>
						<RainbowKitProvider theme={customRainbowTheme}>
							<NavMenu />
							<Outlet />
							<Footer />
						</RainbowKitProvider>
					</QueryClientProvider>
				</WagmiProvider>
			)}
		</Layout>
	);
}
