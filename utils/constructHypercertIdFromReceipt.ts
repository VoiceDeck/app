import { decodeEventLog, type TransactionReceipt } from "viem";
import { debugLog } from "@/utils/debugLog";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";
import type { BigNumber } from "@ethersproject/bignumber";

export const constructTokenIdsFromSplitFractionContractReceipt = (
	receipt: TransactionReceipt,
) => {
	debugLog(receipt);
	const events = receipt.logs.map((log) =>
		decodeEventLog({
			abi: HypercertMinterAbi,
			data: log.data,
			topics: log.topics,
		}),
	);

	debugLog("events", events);
	if (!events) {
		throw new Error("No events in receipt");
	}

	const BatchValueTransfer = events.find(
		(e) => e.eventName === "BatchValueTransfer",
	);

	if (!BatchValueTransfer) {
		throw new Error("BatchValueTransfer event not found");
	}

	const { args } = BatchValueTransfer;

	if (!args) {
		throw new Error("No args in event");
	}

	// @ts-ignore
	// biome-ignore lint/complexity/useLiteralKeys: <explanation>
	const tokenIds = args["toTokenIDs"] as BigNumber[];
	// @ts-ignore
	// biome-ignore lint/complexity/useLiteralKeys: <explanation>
	const values = args["values"] as BigNumber[];

	if (!tokenIds || tokenIds.length === 0) {
		throw new Error("No tokenId arg in event");
	}

	return tokenIds.map((tokenId, index) => ({
		tokenId: tokenId.toString(),
		value: BigInt(values[index].toString()),
	}));
};
