"use client";

import type { ReactNode } from "react";

import { createWeb3Modal } from "@web3modal/wagmi/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { config, projectId } from "@/config/wagmi";
import { type State, WagmiProvider } from "wagmi";
import { sepolia } from "viem/chains";

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

// Create modal
createWeb3Modal({
	wagmiConfig: config,
	projectId,
	defaultChain: sepolia,
	enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export function WagmiContextProvider({
	children,
	initialState,
}: {
	children: ReactNode;
	initialState?: State;
}) {
	return (
		<WagmiProvider config={config} initialState={initialState}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
}
