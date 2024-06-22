import { cn } from "@/lib/utils";
import "@fontsource-variable/plus-jakarta-sans";
import type { Metadata } from "next";
import "vaul/dist/index.css";
import "./globals.css";

import { cookieToInitialState } from "wagmi";

import { Footer } from "@/components/global/footer";
import { NavMenu } from "@/components/global/nav-menu";
import { siteConfig } from "@/config/site";
import { config } from "@/config/wagmi";
import { WagmiContextProvider } from "@/contexts/wagmi";
import { headers } from "next/headers";
import Script from "next/script";

export const metadata: Metadata = {
	metadataBase: new URL("https://app.voicedeck.org/"),
	title: { default: siteConfig.name, template: "%s | Edge Esmeralda" },
	description: siteConfig.description,
	icons: [
		{
			rel: "icon",
			type: "image/x-icon",
			url: "/favicon.svg",
			media: "(prefers-color-scheme: light)",
		},
		{
			rel: "icon",
			type: "image/png",
			url: "/favicon-dark.svg",
			media: "(prefers-color-scheme: dark)",
		},
	],
	openGraph: {
		title: { default: "Edge Esmeralda", template: "%s | Edge Esmeralda" },
		description: siteConfig.description,
		type: "website",
		images: [{ url: "/opengraph-image.png", alt: "Edge Esmeralda" }],
	},
	twitter: {
		card: "summary_large_image",
		site: "@edge-esmeralda",
		title: { default: "Edge Esmeralda", template: "%s | Edge Esmeralda" },
		description: siteConfig.description,
		images: [{ url: "/opengraph-image.png", alt: "Edge Esmeralda" }],
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
					"flex min-h-screen flex-col bg-background font-sans antialiased",
				)}
			>
				<WagmiContextProvider initialState={initialState}>
					<NavMenu />
					<div className="flex-1">{children}</div>
					<Footer />
				</WagmiContextProvider>
				<Script
					id="matomo-tracking"
					strategy="afterInteractive"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{
						__html: `
							var _paq = window._paq = window._paq || [];
							_paq.push(['trackPageView']);
							_paq.push(['enableLinkTracking']);
							(function() {
								var u="https://psedev.matomo.cloud/";
								_paq.push(['setTrackerUrl', u+'matomo.php']);
								_paq.push(['setSiteId', '13']);
								var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
								g.async=true; g.src='https://cdn.matomo.cloud/psedev.matomo.cloud/matomo.js';
								s.parentNode.insertBefore(g,s);
							})();
						`,
					}}
				/>
			</body>
		</html>
	);
}
