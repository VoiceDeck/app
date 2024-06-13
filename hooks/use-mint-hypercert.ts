import { useQuery } from "@tanstack/react-query";
import { useHypercertClient } from "@/hooks/use-hypercerts-client";
import { usePublicClient, useWaitForTransactionReceipt } from "wagmi";

import {
	type HypercertMetadata,
	HypercertMinterAbi,
	TransferRestrictions,
} from "@hypercerts-org/sdk";
import { parseEther, type TransactionReceipt } from "viem";
import { useState } from "react";
import { postHypercertId } from "@/utils/google/postHypercertId";
import { constructHypercertIdFromReceipt } from "@/utils/constructHypercertIdFromReceipt";

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

	if (receiptData) {
		console.log("no receipt data");
		console.log("receiptData", receiptData);
		// TODO: dynamically get hypercertId form hook or something
		const hypercertId = constructHypercertIdFromReceipt(receiptData, 11155111);
		console.log("hypercertId", hypercertId);
		// const {
		// 	data: googleSheetData,
		// 	isLoading: isGoogleSheetLoading,
		// 	isPending: isGoogleSheetPending,
		// 	isSuccess: isGoogleSheetSuccess,
		// 	isError: isGoogleSheetError,
		// 	error: googleSheetError,
		// } = useQuery({
		// 	queryKey: ["hypercertId", { hypercertId }],
		// 	queryFn: () => fetch(`/api/post-hypercert-id?hypercertId=${hypercertId}`),
		// 	staleTime: Number.POSITIVE_INFINITY,
		// 	enabled: !!hypercertId,
		// });
	}

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
