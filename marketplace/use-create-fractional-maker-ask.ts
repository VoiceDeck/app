import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { sepolia } from "viem/chains";

import {
	HypercertExchangeClient,
	QuoteType,
} from "@hypercerts-org/marketplace-sdk";
import { useEthersProvider } from "@/hooks/use-ethers-provider";
import { useEthersSigner } from "@/hooks/use-ethers-signer";

const useCreateHypercertOrder = () => {
	const { chainId } = useAccount();
	if (!chainId) {
		throw new Error("ChainId is not set");
	}
	const provider = useEthersProvider({ chainId });
	const signer = useEthersSigner({ chainId });
	if (!provider) {
		throw new Error("Provider is not set");
	}
	if (!signer) {
		throw new Error("Signer is not set");
	}

	const hypercertExchangeClient = new HypercertExchangeClient(
		chainId ?? sepolia.id,
		// @ts-ignore
		provider,
		signer,
	);

	if (!hypercertExchangeClient) {
		throw new Error("Hypercert Client is not initialized");
	}
	return useQuery({
		queryKey: ["hypercertOrder"],
		queryFn: async () => [],
		// hypercertExchangeClient.createFractionalSaleMakerAsk({
		// 	startTime: Math.floor(Date.now() / 1000), // Use it to create an order that will be valid in the future (Optional, Default to now)
		//     endTime: Math.floor(Date.now() / 1000) + 86400, // If you use a timestamp in ms, the function will revert
		//     price: parseEther(values.price), // Be careful to use a price in wei, this example is for 1 ETH
		//     itemIds: [fractionTokenId.toString()], // Token id of the NFT(s) you want to sell, add several ids to create a bundle
		//     minUnitAmount: BigInt(values.minUnitsToKeep), // Minimum amount of units to keep after the sale
		//     maxUnitAmount: BigInt(values.maxUnitAmount), // Maximum amount of units to sell
		//     minUnitsToKeep: BigInt(values.minUnitsToKeep), // Minimum amount of units to keep after the sale
		//     sellLeftoverFraction: values.sellLeftoverFraction, // If you want to sell the leftover fraction
		// }),
	});
};

export { useCreateHypercertOrder };
