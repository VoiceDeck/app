"use client";
import ConnectButton from "@/components/connect-button";
import { Button } from "@/components/ui/button";
import { useEthersProvider } from "@/hooks/use-ethers-provider";
import { useEthersSigner } from "@/hooks/use-ethers-signer";
import type { Report } from "@/types";
import { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import { useQuery } from "@tanstack/react-query";
import { waitForTransactionReceipt } from "viem/actions";
import { sepolia } from "viem/chains";
import { useAccount, usePublicClient } from "wagmi";

interface SupportReportFormProps {
	drawerContainer: HTMLDivElement | null;
	hypercertId: Partial<Report>["hypercertId"];
}

async function getOrdersForReport(
	hypercertClient: HypercertExchangeClient | null,
	hypercertId: Partial<Report>["hypercertId"],
	chainId?: number,
) {
	if (!hypercertId) {
		console.warn("[Fetching orders] - No hypercert ID provided");
		return [];
	}
	if (!hypercertClient) {
		console.warn("[Fetching orders] - No hypercert client found");
		return [];
	}
	if (!chainId) {
		console.warn("[Fetching orders] - No chainId provided");
		return [];
	}

	const { data: orders } = await hypercertClient.api.fetchOrdersByHypercertId({
		hypercertId,
		chainId,
	});

	return orders;
}

const SupportReportForm = ({
	drawerContainer,
	hypercertId,
}: SupportReportFormProps) => {
	const { address, isConnected, chainId } = useAccount();

	if (!isConnected && !address) {
		return (
			<div className="flex flex-col gap-4 p-4">
				<div className="flex flex-col gap-4 justify-center items-center">
					<h4 className="font-bold text-center">
						Connect your wallet to support this report
					</h4>
					<ConnectButton />
				</div>
			</div>
		);
	}

	const provider = useEthersProvider({ chainId });
	const signer = useEthersSigner({ chainId });
	const HCExchangeClient = new HypercertExchangeClient(
		chainId ?? sepolia.id,
		// @ts-ignore
		provider,
		signer,
	);

	const publicClient = usePublicClient({ chainId });

	const {
		isPending: isOrdersPending,
		error: orderError,
		data: orders,
	} = useQuery({
		queryKey: ["ordersFromHypercert"],
		queryFn: () =>
			getOrdersForReport(
				HCExchangeClient,
				// TODO: Replace with actual hypercert ID
				"0xa16dfb32eb140a6f3f2ac68f41dad8c7e83c4941-67375908650345815765748172271490105868288",
				chainId,
			),
	});

	if (isOrdersPending) return "Loading...";

	if (orderError) return `An error has occurred: ${orderError.message}`;

	const order = orders?.[0];

	const handleBuyFraction = async (amount: number) => {
		if (!publicClient) {
			console.error("No public client found");
			return;
		}
		if (!order) {
			console.error("No order found");
			return;
		}

		const takerOrder = HCExchangeClient.createFractionalSaleTakerBid(
			order,
			address,
			amount,
			order.price,
		);

		try {
			// Set approval for exchange to spend funds
			const totalPrice = BigInt(order.price) * BigInt(amount);
			const approveTx = await HCExchangeClient.approveErc20(
				order.currency, // Be sure to set the allowance for the correct currency
				totalPrice,
			);
			const approveResult = await waitForTransactionReceipt(publicClient, {
				hash: approveTx.hash as `0x${string}`,
			});
			console.log({ approveResult });
		} catch (e) {
			console.error(e);
		}

		try {
			console.info("making trade", {
				order,
				takerOrder,
				signature: order.signature,
			});
			// Perform the trade
			const { call } = HCExchangeClient.executeOrder(
				order,
				takerOrder,
				order.signature,
			);
			console.info("Awaiting buy signature");
			const tx = await call();
			console.info("Awaiting confirmation");
			const txnReceipt = await waitForTransactionReceipt(publicClient, {
				hash: tx.hash as `0x${string}`,
			});
			console.log({ txnReceipt });
			return txnReceipt;
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<section>
			<form className="flex flex-col gap-4">
				<div>
					<label
						htmlFor="amount"
						className="block text-sm font-semibold text-vd-blue-900"
					>
						Amount
					</label>
					<input
						type="number"
						id="amount"
						name="amount"
						className="w-full px-4 py-2 border border-vd-blue-400 rounded-lg"
					/>
				</div>
				<div>
					<label
						htmlFor="message"
						className="block text-sm font-semibold text-vd-blue-900 py-1"
					>
						Message (optional)
					</label>
					<textarea
						id="message"
						name="message"
						rows={3}
						className="w-full px-4 py-2 border border-vd-blue-400 rounded-lg resize-none"
					/>
				</div>
				<div>
					<label
						htmlFor="hide-name"
						className="flex items-center space-x-2 py-1"
					>
						<input
							type="checkbox"
							id="hide-name"
							name="hide-name"
							className="rounded-sm"
						/>
						<span className="text-sm text-vd-blue-900">Hide my name</span>
					</label>
				</div>
				<div>
					<label htmlFor="hide-amount" className="flex items-center space-x-2">
						<input
							type="checkbox"
							id="hide-amount"
							name="hide-amount"
							className="rounded-sm"
						/>
						<span className="text-sm text-vd-blue-900">
							Hide donation amount
						</span>
					</label>
				</div>
			</form>
			<section className="flex flex-col gap-4 bg-vd-beige-100 rounded-md p-3">
				<div className="flex justify-between">
					<p className="text-sm text-vd-blue-700">Estimated time</p>
					<p className="text-sm text-vd-blue-700">20 seconds</p>
				</div>
				<div className="flex justify-between">
					<p className="text-sm text-vd-blue-700">Transaction fee</p>
					<p className="text-sm text-vd-blue-700">$0.00</p>
				</div>
				<div className="flex justify-between">
					<p className="font-semibold text-vd-blue-900 text-lg">
						You will spend
					</p>
					<p className="font-semibold text-vd-blue-900">$0.00</p>
				</div>
			</section>
			<div className="flex w-full">
				<Button
					className="w-full bg-vd-blue-500 text-white rounded-lg py-3"
					onClick={() => handleBuyFraction(50)}
				>
					Support this report
				</Button>
				{/* <SupportProcessingDrawer container={drawerContainer} /> */}
			</div>
		</section>
	);
};

export default SupportReportForm;
