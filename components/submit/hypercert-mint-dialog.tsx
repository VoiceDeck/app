import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import useMintHypercert from "@/hooks/use-mint-hypercert";
import { MintingError, type HypercertMetadata } from "@hypercerts-org/sdk";
import { Badge, BadgeCheck, BadgeX, Loader, ArrowUpRight } from "lucide-react";
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
	isReceiptLoading,
	isReceiptSuccess,
	isReceiptError,
	receiptError,
	isGoogleSheetsLoading,
	isGoogleSheetsSuccess,
	isGoogleSheetsError,
	googleSheetsError,
	metaData,
	receiptData,
	setMetaData,
	setOpenMintDialog,
}: {
	isMintLoading: boolean;
	isMintSuccess: boolean;
	isMintError: boolean;
	mintData?: Address;
	mintError: Error | null;
	isReceiptLoading: boolean;
	isReceiptSuccess: boolean;
	isReceiptError: boolean;
	isGoogleSheetsLoading: boolean;
	isGoogleSheetsSuccess: boolean;
	isGoogleSheetsError: boolean;
	googleSheetsError: Error | null;
	receiptError: WaitForTransactionReceiptErrorType | null;
	metaData: HypercertMetadata | null;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	receiptData?: WaitForTransactionReceiptData<any, any>;
	setMetaData: Dispatch<SetStateAction<HypercertMetadata | undefined>>;
	setOpenMintDialog: Dispatch<SetStateAction<boolean>>;
}) => {
	const handleCloseDialog = () => {
		setOpenMintDialog(false);
		setMetaData(undefined);
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
						{!isMintSuccess && !isMintLoading && !isMintError && (
							<>
								<Badge className="h-5 w-5" />
								<p>Preparing to mint hypercert...</p>
							</>
						)}
						{isMintLoading && (
							<>
								<Loader className="h-5 w-5 animate-spin" />
								<p>Minting hypercert on chain...</p>
							</>
						)}
						{isMintSuccess && (
							<>
								<BadgeCheck className="h-5 w-5" />
								<p className="">Transaction processed</p>
							</>
						)}
						{isMintError && mintError && (
							<>
								<BadgeX className="h-5 w-5" />
								<p className="">
									Minting Error:{" "}
									{mintError.message
										? mintError.message
										: "Error minting Hypercert. Please try again."}
								</p>
							</>
						)}
					</div>
					<div className="flex items-center justify-start gap-2">
						{!isReceiptSuccess && !isReceiptLoading && !isReceiptError && (
							<>
								<Badge className="h-5 w-5" />
								<p>Waiting for transaction to process...</p>
							</>
						)}
						{isReceiptLoading && (
							<>
								<Loader className="h-5 w-5 animate-spin" />
								<p>Waiting for transaction receipt...</p>
							</>
						)}
						{isReceiptSuccess && (
							<>
								<BadgeCheck className="h-5 w-5" />
								<p className="">Hypercert minted successfully!</p>
							</>
						)}
						{isReceiptError && receiptError && (
							<>
								<BadgeX className="h-5 w-5" />
								<p className="">
									Minting Error:{" "}
									{receiptError.message
										? receiptError.message
										: "Error processing transaction. Please try again."}
								</p>
							</>
						)}
					</div>
					<div className="flex items-center justify-start gap-2">
						{!isGoogleSheetsSuccess &&
							!isGoogleSheetsLoading &&
							!isGoogleSheetsError && (
								<>
									<Badge className="h-5 w-5" />
									<p>Waiting to send to Edge Esmeralda for approval...</p>
								</>
							)}
						{isGoogleSheetsLoading && (
							<>
								<Loader className="h-5 w-5 animate-spin" />
								<p>Sending to Edge Esmeralda team...</p>
							</>
						)}
						{isGoogleSheetsSuccess && (
							<>
								<BadgeCheck className="h-5 w-5" />
								<p className="">Sent to Edge Esmeralda team!</p>
							</>
						)}
						{isGoogleSheetsError && googleSheetsError && (
							<>
								<BadgeX className="h-5 w-5" />
								<p className="">
									Upload for approval error:{" "}
									{googleSheetsError.message
										? googleSheetsError.message
										: "Error processing transaction. Please try again."}
								</p>
							</>
						)}
					</div>
					{isReceiptSuccess && receiptData && (
						<div className="flex items-center justify-start gap-2">
							<a
								className="flex items-center text-blue-600"
								href={`https://sepolia.etherscan.io/tx/${receiptData.transactionHash}`}
							>
								<span className="text-sm">View transaction on etherscan</span>
								<ArrowUpRight className="h-3 w-3" />
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
