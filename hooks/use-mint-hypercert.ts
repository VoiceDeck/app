import { useMutation } from "@tanstack/react-query";
import { useHypercertClient } from "@/hooks/use-hypercerts-client";
import { usePublicClient, useWaitForTransactionReceipt } from "wagmi";

import {
	type HypercertMetadata,
	TransferRestrictions,
} from "@hypercerts-org/sdk";
import { parseEther, type TransactionReceipt } from "viem";
import { useEffect, useState } from "react";
import { constructHypercertIdFromReceipt } from "@/utils/constructHypercertIdFromReceipt";
import { useAddHypercertIdToGoogleSheet } from "./use-add-hypercert-id-to-google-sheets";

type Payload = {
	metaData: HypercertMetadata;
	contactInfo: string;
	amount: string;
};

const useMintHypercert = () => {
	const [contactInfo, setContactInfo] = useState<string | undefined>();
	const [metaData, setMetaData] = useState<HypercertMetadata | undefined>();
	const { client } = useHypercertClient();
	const publicClient = usePublicClient();

	if (!client) {
		throw new Error("Hypercert Client is not initialized");
	}

	if (!publicClient) {
		throw new Error("Public client is not initialized");
	}

	const {
		mutate: mintHypercert,
		data: mintData,
		status: mintStatus,
		isIdle: isMintIdle,
		isPending: isMintPending,
		isSuccess: isMintSuccess,
		isError: isMintError,
		error: mintError,
	} = useMutation({
		mutationFn: (payload: Payload) => {
			const { metaData, contactInfo, amount } = payload;
			console.log("contactInfo", contactInfo);
			console.log("amount", amount);
			setContactInfo(contactInfo);
			return client.mintClaim(
				metaData,
				parseEther("1"),
				TransferRestrictions.FromCreatorOnly,
			);
		},
	});

	console.log("mintData", mintData);

	const {
		data: receiptData,
		isLoading: isReceiptLoading,
		isPending: isReceiptPending,
		isSuccess: isReceiptSuccess,
		isError: isReceiptError,
		error: receiptError,
	} = useWaitForTransactionReceipt({
		hash: mintData,
		query: {
			enabled: !!mintData,
			select: (data) => {
				const hypercertId = constructHypercertIdFromReceipt(
					data as TransactionReceipt,
					publicClient.chain.id,
				);
				return {
					...data,
					hypercertId,
				};
			},
			staleTime: Number.POSITIVE_INFINITY,
		},
	});

	const {
		data: googleSheetsData,
		mutate: updateGoogleSheets,
		status: googleSheetsStatus,
		error: googleSheetsError,
	} = useAddHypercertIdToGoogleSheet();

	useEffect(() => {
		if (receiptData?.hypercertId) {
			updateGoogleSheets({ hypercertId: receiptData.hypercertId });
		}
	}, [receiptData?.hypercertId, updateGoogleSheets]);

	return {
		mintHypercert,
		mintStatus,
		isMintIdle,
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
		googleSheetsStatus,
		googleSheetsError,
		metaData,
		setMetaData,
	};
};

export default useMintHypercert;
