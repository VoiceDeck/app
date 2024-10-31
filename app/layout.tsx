import { cn } from "@/lib/utils";
import "@fontsource-variable/plus-jakarta-sans";
import type { Metadata } from "next";
import "./globals.css";

import { cookieToInitialState } from "wagmi";

import { Footer } from "@/components/global/footer";
import { NavMenu } from "@/components/global/nav-menu";
import { siteConfig } from "@/config/site";
import { config } from "@/config/wagmi";
import { PrivyContextProvider } from "@/contexts/privy";
import { WagmiContextProvider } from "@/contexts/wagmi";
import { PrivyProvider } from "@privy-io/react-auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
	metadataBase: new URL("https://app.voicedeck.org/"),
	title: { default: siteConfig.name, template: "%s | VoiceDeck" },
	description: siteConfig.description,
	icons: [
		{ rel: "shortcut icon", url: "/favicon.ico", type: "image/x-icon" },
		{ rel: "icon", url: "/favicon-16x16.png", sizes: "16x16" },
		{ rel: "icon", url: "/favicon-32x32.png", sizes: "32x32" },
		{ rel: "icon", url: "/favicon-192x192.png", sizes: "192x192" },
		{ rel: "icon", url: "/favicon-512x512.png", sizes: "512x512" },
	],
	openGraph: {
		title: { default: "VoiceDeck", template: "%s | VoiceDeck" },
		description: siteConfig.description,
		type: "website",
		images: [{ url: "/opengraph-image.png", alt: "VoiceDeck" }],
	},
	twitter: {
		card: "summary_large_image",
		site: "@voicedeck",
		title: { default: "VoiceDeck", template: "%s | VoiceDeck" },
		description: siteConfig.description,
		images: [{ url: "/opengraph-image.png", alt: "VoiceDeck" }],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const initialState = cookieToInitialState(config, headers().get("cookie"));
	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased flex flex-col",
				)}
			>
				<PrivyContextProvider>
					<WagmiContextProvider initialState={initialState}>
						<NavMenu />
						<div className="flex-1">{children}</div>
						<Footer />
					</WagmiContextProvider>
				</PrivyContextProvider>
			</body>
		</html>
	);
}
