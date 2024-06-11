import { useQuery } from "@tanstack/react-query";
import { useHypercertClient } from "@/hooks/use-hypercerts-client";
import { usePublicClient, useWaitForTransactionReceipt } from "wagmi";

import {
	type HypercertMetadata,
	TransferRestrictions,
} from "@hypercerts-org/sdk";

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

	const {
		data: mintClaimData,
		isLoading: isLoadingMintClaim,
		isSuccess: isSuccessMintClaim,
		isError: isErrorMintClaim,
		error: mintClaimError,
	} = useQuery({
		queryKey: ["hypercert", { metaData, units, transferRestrictions }],
		queryFn: () =>
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			client.mintClaim(metaData!, BigInt(units), transferRestrictions),
		enabled: !!metaData,
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
