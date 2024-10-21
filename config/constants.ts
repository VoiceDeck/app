import { optimism, sepolia } from "viem/chains";
import { Chain } from "viem";
import { Environment } from "@hypercerts-org/sdk";

export const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID;
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT as Environment;

export const testNetChains = [sepolia] as const;
export const prodNetChains = [optimism] as const;

export const SUPPORTED_CHAINS = (
  ENVIRONMENT === "production" ? prodNetChains : testNetChains
) as readonly [Chain, ...Chain[]];
const allChains = [
  ...testNetChains.map((x) => x.id),
  ...prodNetChains.map((x) => x.id),
] as const;

export type SupportedChainIdType = (typeof allChains)[number];
