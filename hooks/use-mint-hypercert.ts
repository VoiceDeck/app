import { useQuery } from "@tanstack/react-query";
import { useHypercertClient } from "@/hooks/use-hypercerts-client";
import { usePublicClient, useWaitForTransactionReceipt } from "wagmi";
import { metadata } from "@/app/layout";
import type {
	HypercertMetadata,
	TransferRestrictions,
} from "@hypercerts-org/sdk";

const useMintHypercert = (
	metaData: HypercertMetadata,
	units: number,
	transferRestrictions: TransferRestrictions,
) => {
	const { client } = useHypercertClient();

	if (!client) {
		// toast("No client found", {
		//   type: "error",
		// });
		throw new Error("Client is not initialized");
	}

	const publicClient = usePublicClient();
	if (!publicClient) {
		// toast("No public client found", {
		//   type: "error",
		// });
		throw new Error("Public client is not initialized");
	}

	const {
		data: mintData,
		isLoading,
		isSuccess,
		error,
	} = useQuery({
		queryKey: ["hypercerts", { metaData, units, transferRestrictions }],
		queryFn: () =>
			client.mintClaim(metaData, BigInt(units), transferRestrictions),
	});

	const {
		isFetching: isFetchingReceipt,
		isLoading: isLoadingReceipt,
		data: receipt,
		isFetched: isFetchedReceipt,
		isSuccess: isSuccessReceipt,
		isError: isErrorReceipt,
		error: errorTransaction,
	} = useWaitForTransactionReceipt({
		hash: mintData,
	});

	return {
		isLoading,
		isSuccess,
		error,
		isFetchingReceipt,
		isLoadingReceipt,
		isFetchedReceipt,
		isSuccessReceipt,
		isErrorReceipt,
		receipt,
	};
};
