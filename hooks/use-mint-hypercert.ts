import { useQuery } from "@tanstack/react-query";
import { useHypercertClient } from "@/hooks/use-hypercerts-client";
import { usePublicClient, useWaitForTransactionReceipt } from "wagmi";

import {
	type HypercertMetadata,
	TransferRestrictions,
} from "@hypercerts-org/sdk";
import { parseEther } from "viem";

interface MintHypercertParams {
	metaData: HypercertMetadata | null;
	units?: number;
	transferRestrictions?: TransferRestrictions;
}

const useMintHypercert = ({
	metaData,
	units = 1,
	transferRestrictions = TransferRestrictions.FromCreatorOnly,
}: MintHypercertParams) => {
	const { client } = useHypercertClient();

	if (!client) {
		throw new Error("Hypercert Client is not initialized");
	}

	const publicClient = usePublicClient();
	if (!publicClient) {
		throw new Error("Public client is not initialized");
	}

	console.log("metaData", metaData);

	const {
		data: mintClaimData,
		isLoading: isLoadingMintClaim,
		isSuccess: isSuccessMintClaim,
		isError: isErrorMintClaim,
		error: mintClaimError,
	} = useQuery({
		queryKey: ["hypercert", { metaData }],
		queryFn: async () => {
			if (!metaData) {
				throw new Error("Metadata is null");
			}
			return await client.mintClaim(
				metaData,
				parseEther("1"),
				transferRestrictions,
			);
		},
		staleTime: Number.POSITIVE_INFINITY,
		enabled: metaData !== null || metaData !== undefined ? true : false,
	});

	const {
		isFetching: isFetchingReceipt,
		isLoading: isLoadingReceipt,
		data: receipt,
		isFetched: isFetchedReceipt,
		isSuccess: isSuccessReceipt,
		isError: isErrorReceipt,
		error: errorReceipt,
	} = useWaitForTransactionReceipt({
		hash: mintClaimData,
	});

	return {
		isLoadingMintClaim,
		isSuccessMintClaim,
		isErrorMintClaim,
		isFetchingReceipt,
		isLoadingReceipt,
		isFetchedReceipt,
		isSuccessReceipt,
		isErrorReceipt,
		mintClaimData,
		mintClaimError,
		errorReceipt,
		receipt,
	};
};

export default useMintHypercert;
