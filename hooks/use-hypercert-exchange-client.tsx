"use client";
import { useEffect, useState } from "react";

import { getEthersProvider, getEthersSigner } from "@/lib/ethers";
import { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useConfig, useWalletClient } from "wagmi";

const isSupportedChain = (chainId: number) => {
	const supportedChainIds = [10, 42220, 11155111]; // Replace with actual chain IDs

	return supportedChainIds.includes(chainId);
};

export const useHypercertExchangeClient = ({
	overrideChainId,
}: {
	overrideChainId?: number;
} = {}) => {
	const { chain } = useAccount();

	const { data: signer } = useQuery({
		queryKey: ["signer"],
		queryFn: () =>
			getEthersSigner(config, { chainId: chain?.id }).then((signer) => signer),
		enabled: !!chain?.id,
	});

	const config = useConfig();
	const clientConfig = {
		chain: overrideChainId ? { id: overrideChainId } : { id: chain?.id },
		provider: getEthersProvider(config, { chainId: chain?.id }),
		signer,
	};
	const [client, setClient] = useState<HypercertExchangeClient | null>(() => {
		if (clientConfig.chain?.id && isSupportedChain(clientConfig.chain?.id)) {
			return new HypercertExchangeClient(
				clientConfig.chain.id,
				clientConfig.provider,
				clientConfig.signer,

				// this is asking for wallet client but idk what to do with it anymore
			);
		}
		return null;
	});
	const [isLoading, setIsLoading] = useState(false);

	const {
		data: walletClient,
		isError,
		isLoading: walletClientLoading,
	} = useWalletClient();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const chainId = overrideChainId || chain?.id;
		if (
			chainId &&
			isSupportedChain(chainId) &&
			!walletClientLoading &&
			!isError &&
			walletClient
		) {
			setIsLoading(true);

			try {
				const config = {
					...clientConfig,
					chain: { id: chainId },
					// walletClient: walletClient as any,
				};

				const client = new HypercertExchangeClient(
					config.chain?.id,
					config.provider,
				);
				setClient(client);
			} catch (e) {
				console.error(e);
			}
		}

		setIsLoading(false);
	}, [chain?.id, overrideChainId, walletClient, walletClientLoading]);

	return { client, isLoading };
};
