import { optimism, sepolia } from "viem/chains";
import { Chain } from "viem";
import { Environment } from "@hypercerts-org/sdk";

export const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID;
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT as Environment;

// This is the Doogly gateway for receiving cross-chain donations on Optimism
export const DOOGLY_CONTRACT =
  process.env.NEXT_PUBLIC_DOOGLY_CONTRACT ??
  "0x3652eC40C4D8F3e804373455EF155777F250a6E2";
// Allo pool id to transfer donations
// If 0 then DONATION_RECEIVER could be EOA or Split Contract
// Else DONATION_RECEIVER is expected to be Allo pool contract
export const ALLO_POOLID = process.env.NEXT_PUBLIC_ALLO_POOLID ?? 0;
// Donation receiver address
export const DONATION_RECEIVER =
  process.env.NEXT_PUBLIC_DONATION_RECEIVER ??
  "0xD8813c65a4A21772C360f32B2C7960040fa84a8B";
// Token address to receive donations in, defaults to USDC
export const RECEIVING_TOKEN =
  process.env.NEXT_PUBLIC_RECEIVING_TOKEN ??
  "0x7F5c764cBc14f9669B88837ca1490cCa17c31607";

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
