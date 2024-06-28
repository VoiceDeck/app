import { base, baseSepolia, celo, optimism, sepolia } from "viem/chains";
import type { Chain } from "viem";

export const apiEnvironment: "test" | "production" = (process.env[
	"NEXT_PUBLIC_API_ENVIRONMENT"
] || "test") as "test" | "production";

export const testNetChains = [sepolia, baseSepolia] as const;
export const prodNetChains = [optimism, celo, base] as const;

export const supportedChains = (
	apiEnvironment === "production" ? prodNetChains : testNetChains
) as readonly [Chain, ...Chain[]];
const allChains = [
	...testNetChains.map((x) => x.id),
	...prodNetChains.map((x) => x.id),
] as const;
export type SupportedChainIdType = (typeof allChains)[number];
