import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "vaul/dist/index.css"
import { cn } from "@/lib/utils";

import { cookieToInitialState } from 'wagmi'

import { headers } from "next/headers";
import { WagmiContextProvider } from "@/contexts/wagmi";
import { config } from "@/config/wagmi";
import { siteConfig } from "@/config/site";

const fontSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang="en">
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
			>
				<WagmiContextProvider initialState={initialState}>
				{children}
				</WagmiContextProvider></body>
    </html>
  );
}
