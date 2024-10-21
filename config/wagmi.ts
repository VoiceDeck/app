import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { getVoiceDeckUrl } from "./endpoint";
import { optimism } from "viem/chains";

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

// TODO: Add correct data
const metadata = {
  name: "VoiceDeck",
  description: "Funding for Indian journalists",
  url: getVoiceDeckUrl(), // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create wagmiConfig
export const config = defaultWagmiConfig({
  chains: [optimism], // required
  projectId, // required
  metadata, // required
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
