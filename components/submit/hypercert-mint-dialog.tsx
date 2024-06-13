import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import useMintHypercert from "@/hooks/use-mint-hypercert";
import type { HypercertMetadata } from "@hypercerts-org/sdk";
import { Badge, BadgeCheck, CircleCheck, Loader, Loader2 } from "lucide-react";
import type React from "react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import type {
	Address,
	TransactionReceipt,
	WaitForTransactionReceiptErrorType,
} from "viem";
import type { UseWaitForTransactionReceiptReturnType } from "wagmi";
import type { WaitForTransactionReceiptData } from "wagmi/query";
import { config, projectId } from "@/config/wagmi";

const HypercertMintDialog = ({
	isMintLoading,
	isMintSuccess,
	isMintError,
	mintData,
	mintError,
	isReceiptPending,
	isReceiptLoading,
	isReceiptSuccess,
	isReceiptError,
	receiptError,
	metaData,
	receiptData,
	setMetaData,
	setOpenMintDialog,
}: {
	isMintLoading: boolean;
	isMintPending: boolean;
	isMintSuccess: boolean;
	isMintError: boolean;
	mintData?: Address;
	mintError: Error | null;
	isReceiptPending: boolean;
	isReceiptLoading: boolean;
	isReceiptSuccess: boolean;
	isReceiptError: boolean;
	receiptError: WaitForTransactionReceiptErrorType | null;
	metaData: HypercertMetadata | null;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	receiptData?: WaitForTransactionReceiptData<any, any>;
	setMetaData: Dispatch<SetStateAction<HypercertMetadata | null>>;
	setOpenMintDialog: Dispatch<SetStateAction<boolean>>;
}) => {
	const handleCloseDialog = () => {
		setOpenMintDialog(false);
		setMetaData(null);
	};

	return (
		<div>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Minting Hypercert</DialogTitle>
					<DialogDescription>
						This will show the status of the minting process.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-start gap-2">
						{!isReceiptSuccess && !isReceiptSuccess && (
							<Badge className="h-5 w-5" />
						)}
						{isMintLoading && <Loader className="h-5 w-5 animate-spin" />}
						{isMintSuccess && <BadgeCheck className="h-5 w-5" />}
						<p className="">
							{isMintSuccess
								? "Minting hypercert on chain..."
								: "Preparing to mint hypercert..."}
						</p>
					</div>
					<div className="flex items-center justify-start gap-2">
						{!isReceiptSuccess && !isReceiptSuccess && (
							<Badge className="h-5 w-5" />
						)}
						{isReceiptLoading && <Loader className="h-5 w-5 animate-spin" />}
						{isReceiptSuccess && <BadgeCheck className="h-5 w-5" />}
						<p className="">
							{isMintSuccess ? "Minting complete" : "Awaiting confirmation..."}
						</p>
					</div>
					{isReceiptSuccess && receiptData && (
						<div className="flex items-center justify-center gap-2">
							<a
								href={`https://sepolia.etherscan.io/tx/${receiptData.transactionHash}`}
							>
								View transaction on etherscan
							</a>
						</div>
					)}
				</div>
				<DialogFooter>
					<Button type="button" onClick={handleCloseDialog}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</div>
	);
};

export { HypercertMintDialog };
