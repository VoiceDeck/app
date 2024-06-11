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
import { CircleCheck, Loader2 } from "lucide-react";
import type React from "react";
import type { Dispatch, SetStateAction } from "react";

const HypercertMintDialog = ({
	hypercertMetadata,
	setHypercertMetadata,
	setOpenMintDialogChange,
	clearFormData,
}: {
	hypercertMetadata: HypercertMetadata | null;
	setHypercertMetadata: Dispatch<SetStateAction<HypercertMetadata | null>>;
	setOpenMintDialogChange: Dispatch<SetStateAction<boolean>>;
	clearFormData: () => void;
}) => {
	const {
		isLoadingMintClaim,
		isSuccessMintClaim,
		mintClaimData,
		mintClaimError,
		isFetchingReceipt,
		isLoadingReceipt,
		isSuccessReceipt,
		isErrorReceipt,
		receipt,
	} = useMintHypercert({
		metaData: hypercertMetadata,
	});

	console.log("mintClaimData", mintClaimData);
	console.log("receipt", receipt);

	if (isSuccessReceipt) {
		setHypercertMetadata(null);
	}

	const handleDialogClose = () => {
		setHypercertMetadata(null);
		setOpenMintDialogChange(false);
		clearFormData();
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
					<div className="flex items-center justify-center gap-2">
						{isLoadingMintClaim ? (
							<Loader2 className="h-5 w-5 animate-spin" />
						) : (
							<CircleCheck className="h-5 w-5" />
						)}
						<p>Waiting for Signature</p>
					</div>
					<div className="flex items-center justify-center gap-2">
						{isSuccessMintClaim ? (
							<Loader2 className="h-5 w-5 animate-spin" />
						) : (
							<CircleCheck className="h-5 w-5" />
						)}
						<p>Claim minted</p>
					</div>
					{mintClaimError && <div>Error: {mintClaimError.message}</div>}
					<div className="flex items-center justify-center gap-2">
						{isLoadingReceipt ? (
							<Loader2 className="h-5 w-5 animate-spin" />
						) : (
							<CircleCheck className="h-5 w-5" />
						)}
						<p>Waiting for Transaction</p>
					</div>
					{isErrorReceipt && <div>Error receipt: </div>}
					{isSuccessReceipt && receipt && (
						<div>Success receipt: {receipt.transactionHash}</div>
					)}
				</div>
				<DialogFooter>
					<Button type="button" onClick={handleDialogClose}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</div>
	);
};

export { HypercertMintDialog };
