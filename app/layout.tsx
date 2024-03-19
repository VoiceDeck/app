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

export const metadata: Metadata = {
	title: siteConfig.title,
	description: siteConfig.description,
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
				<WagmiContextProvider initialState={initialState}>
					<NavMenu />
					<div className="flex-1">{children}</div>
					<Footer />
				</WagmiContextProvider>
			</body>
		</html>
	);
}
