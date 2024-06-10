import { HypercertClient } from "@hypercerts-org/sdk";
import { useMemo } from "react";
import { useChainId, useWalletClient } from "wagmi";

export const useHypercertClient = () => {
	const chainId = useChainId();
	const { data: walletClient } = useWalletClient();

	// The SDK will throw an error if the chain is not supported; only testnet for demo purposes
	const isSupportedChain = (chainId: number) => {
		return chainId === 11155111 || chainId === 84522;
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const client = useMemo(
		() =>
			chainId && isSupportedChain(chainId)
				? new HypercertClient({
						// commented out untill package is updated
						// indexerEnvironment: "test",
						chain: { id: chainId },
						walletClient: walletClient ?? undefined,
				  })
				: undefined,
		[chainId, walletClient],
	);

	return { client };
};
