import { http, WagmiProvider, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

declare module "wagmi" {
	interface Register {
		config: typeof config;
	}
}

const config = createConfig({
	chains: [mainnet, sepolia],
	transports: {
		[mainnet.id]: http(),
		[sepolia.id]: http(),
	},
});

const Web3Provider = ({ children }: { children: React.ReactNode }) => {
	return <WagmiProvider config={config}>{children}</WagmiProvider>;
};

export default Web3Provider;
