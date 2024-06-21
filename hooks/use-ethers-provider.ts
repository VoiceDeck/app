import type { HttpTransport, PublicClient } from "viem";
import { JsonRpcProvider, FallbackProvider } from "ethers";

import { usePublicClient } from "wagmi";
import React from "react";

export function publicClientToProvider(publicClient: PublicClient) {
	const { chain, transport } = publicClient;
	if (!chain || !transport) return undefined;
	const network = {
		chainId: chain.id,
		name: chain.name,
		ensAddress: chain.contracts?.ensRegistry?.address,
	};
	if (transport.type === "fallback") {
		const providers = (transport.transports as ReturnType<HttpTransport>[]).map(
			({ value }) => new JsonRpcProvider(value?.url, network),
		);
		if (providers.length === 1) return providers[0];
		return new FallbackProvider(providers);
	}
	return new JsonRpcProvider(transport.url, network);
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
	const publicClient = usePublicClient({ chainId });
	return React.useMemo(() => {
		if (publicClient === undefined) return undefined;
		return publicClientToProvider(publicClient);
	}, [publicClient]);
}
