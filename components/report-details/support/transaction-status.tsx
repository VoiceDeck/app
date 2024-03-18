import { Button } from "@/components/ui/button";
import type { TransactionStatuses } from "@/hooks/use-buy-fraction";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import React from "react";
import type { Address } from "viem";

interface TransactionStatusProps {
	statusContent: {
		label: keyof typeof TransactionStatuses;
		title: string;
		content: string;
		icon: React.ReactNode;
	};
	transactionHash?: Address | null;
}

// components/report-details/support/TransactionStatus.tsx
const TransactionStatus = ({
	statusContent: status,
	transactionHash,
}: TransactionStatusProps) => {
	return (
		<div
			className={cn(
				"flex flex-col gap-2 p-4 rounded-md bg-vd-beige-100 border-vd-beige-200 border-2",
			)}
		>
			<div
				className={cn("flex justify-center", {
					"animate-spin": status.label === "Pending",
				})}
			>
				{status.icon}
			</div>
			<div className="flex flex-col gap-4">
				<h4 className="font-bold text-lg text-center">{status.title}</h4>
				<p className="text-center">{status.content}</p>
				{transactionHash && (
					<Button
						variant={"default"}
						className="hover:bg-vd-blue-400 hover:text-green-50 transition-colors duration-200"
					>
						<a
							// TODO: UPDATE FOR MAINNET WHEN READY
							href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
							target="_blank"
							rel="noopener noreferrer"
							className="w-full h-full flex gap-2 justify-center items-center"
						>
							View transaction on explorer
							<ArrowUpRight size={16} />
						</a>
					</Button>
				)}
			</div>
			{status.label !== "Pending" && (
				<Button
					className="space-y-1.5"
					variant={"outline"}
					type="button"
					onClick={() => window.location.reload()}
				>
					Close
				</Button>
			)}
		</div>
	);
};

export default React.memo(TransactionStatus);
