import { useQuery } from "@tanstack/react-query";
import { useHypercertClient } from "@/hooks/use-hypercerts-client";
import { usePublicClient, useWaitForTransactionReceipt } from "wagmi";

import {
	type HypercertMetadata,
	TransferRestrictions,
} from "@hypercerts-org/sdk";
import { parseEther } from "viem";
import { useState } from "react";

const useMintHypercert = () => {
	const [metaData, setMetaData] = useState<HypercertMetadata | null>(null);
	const { client } = useHypercertClient();

	if (!client) {
		throw new Error("Hypercert Client is not initialized");
	}

	const publicClient = usePublicClient();
	if (!publicClient) {
		throw new Error("Public client is not initialized");
	}

	const {
		data: mintData,
		isLoading: isMintLoading,
		isPending: isMintPending,
		isSuccess: isMintSuccess,
		isError: isMintError,
		error: mintError,
	} = useQuery({
		queryKey: ["hypercert", { metaData }],
		queryFn: async () => {
			if (!metaData) {
				throw new Error("Metadata is null");
			}
			return await client.mintClaim(
				metaData,
				parseEther("1"),
				TransferRestrictions.FromCreatorOnly,
			);
		},
		staleTime: 60 * 1000,
		enabled: !!metaData,
	});

	const {
		data: receiptData,
		isLoading: isReceiptLoading,
		isPending: isReceiptPending,
		isSuccess: isReceiptSuccess,
		isError: isReceiptError,
		status: receiptStatus,
		error: receiptError,
	} = useWaitForTransactionReceipt({
		hash: mintData,
	});

	return {
		isMintLoading,
		isMintPending,
		isMintSuccess,
		isMintError,
		mintData,
		mintError,
		receiptData,
		receiptError,
		isReceiptPending,
		isReceiptLoading,
		isReceiptSuccess,
		isReceiptError,
		metaData,
		setMetaData,
	};
};

export default useMintHypercert;
