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
import { useAddHypercertIdToGoogleSheet } from "./use-add-hypercert-id-to-google-sheets";

const useMintHypercert = () => {
	const [metaData, setMetaData] = useState<HypercertMetadata | undefined>();
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
		staleTime: Number.POSITIVE_INFINITY,
		enabled: !!metaData,
	});

	const {
		data: receiptData,
		isLoading: isReceiptLoading,
		isPending: isReceiptPending,
		isSuccess: isReceiptSuccess,
		isError: isReceiptError,
		error: receiptError,
	} = useWaitForTransactionReceipt({
		hash: mintData,
	});

	const hypercertId = constructHypercertIdFromReceipt(
		receiptData as TransactionReceipt,
		publicClient.chain.id,
	);

	const {
		data: googleSheetsData,
		isLoading: isGoogleSheetsLoading,
		isPending: isGoogleSheetsPending,
		isSuccess: isGoogleSheetsSuccess,
		isError: isGoogleSheetsError,
		error: googleSheetsError,
	} = useAddHypercertIdToGoogleSheet(hypercertId);

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
		googleSheetsData,
		googleSheetsError,
		isGoogleSheetsLoading,
		isGoogleSheetsPending,
		isGoogleSheetsSuccess,
		isGoogleSheetsError,
		metaData,
		setMetaData,
	};
};

export default useMintHypercert;
