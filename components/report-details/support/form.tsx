"use client";
import { ConnectButton } from "@/components/global/connect-button";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useFunding } from "@/contexts/funding-context";
import {
	type TransactionStatuses,
	useHandleBuyFraction,
} from "@/hooks/use-buy-fraction";
import { useEthersProvider } from "@/hooks/use-ethers-provider";
import { useEthersSigner } from "@/hooks/use-ethers-signer";
import useSupportForm from "@/hooks/use-support-form";
import { cn } from "@/lib/utils";
import type { Report } from "@/types";
import { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle, Loader2, Wallet2 } from "lucide-react";
import { sepolia } from "viem/chains";
import { useAccount, usePublicClient } from "wagmi";
import TransactionStatus from "./transaction-status";

import { dummyFractions } from "@/lib/constants";

interface SupportReportFormProps {
	drawerContainer: HTMLDivElement | null;
	hypercertId: Partial<Report>["hypercertId"];
}

const transactionStatusContent: Record<
	keyof typeof TransactionStatuses,
	{
		icon: JSX.Element;
		title: string;
		content: string;
		label: keyof typeof TransactionStatuses;
	}
> = {
	Pending: {
		label: "Pending",
		icon: <Loader2 size={36} />,
		title: "Just a moment! We're working on it.",
		content: "We're connecting to your wallet to process the transaction.",
	},
	Failed: {
		label: "Failed",
		icon: <AlertTriangle size={36} />,
		title: "Sorry! There was an issue.",
		content:
			"We ran into a problem while processing the transaction. Could you try again?",
	},
	Confirmed: {
		label: "Confirmed",
		icon: <CheckCircle size={36} />,
		title: "Thank you! We got your support.",
		content:
			"Your transaction was successful. We're grateful for your contribution!",
	},
};

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
	if (chainId === undefined) {
		console.warn("[Fetching orders] - No chainId provided");
		return [];
	}

	try {
		let result: unknown;
		if (process.env.NEXT_PUBLIC_ORDER_WORKAROUND === "on") {
			const workaroundTokenId =
				dummyFractions[hypercertId as keyof typeof dummyFractions];
			console.log(`workaroundTokenId: ${workaroundTokenId.tokenID}`);
			const { data: orders } = await hypercertClient.api.fetchOrders({
				claimTokenIds: [workaroundTokenId.tokenID],
			});

			result = orders;
		} else if (process.env.ORDER_FETCHING !== "on") {
			const { data: orders } =
				await hypercertClient.api.fetchOrdersByHypercertId({
					hypercertId:
						"0xa16dfb32eb140a6f3f2ac68f41dad8c7e83c4941-39472754562828861761751454462085112528896",
					chainId,
				});
			result = orders;
		} else if (process.env.ORDER_FETCHING === "on") {
			const { data: orders } =
				await hypercertClient.api.fetchOrdersByHypercertId({
					hypercertId,
					chainId,
				});
			result = orders;
		}

		return result;
	} catch (error) {
		console.error("[Fetching orders] - Error fetching orders", error);
		return [];
	}
}

const SupportReportForm = ({
	drawerContainer,
	hypercertId,
}: SupportReportFormProps) => {
	const { address, isConnected, chainId } = useAccount();
	const provider = useEthersProvider({ chainId });
	const signer = useEthersSigner({ chainId });
	const publicClient = usePublicClient({ chainId });
	const { dollarAmountNeeded, pricePerUnit } = useFunding();

	const HCExchangeClient = new HypercertExchangeClient(
		sepolia.id,
		// @ts-ignore
		provider,
		signer,
	);

	const { handleBuyFraction, transactionStatus, transactionHash } =
		useHandleBuyFraction(publicClient, HCExchangeClient);

	const {
		isPending: isOrdersPending,
		error: orderError,
		data: orders,
	} = useQuery({
		queryKey: ["ordersFromHypercert"],
		queryFn: () => getOrdersForReport(HCExchangeClient, hypercertId, chainId),
	});

	let order: unknown;
	if (process.env.NEXT_PUBLIC_ORDER_WORKAROUND === "on") {
		// @ts-ignore
		order = orders?.[1];
	} else {
		// @ts-ignore
		order = orders?.[5];
	}
	const { form, onSubmit, isProcessing } = useSupportForm(
		Number(dollarAmountNeeded),
		pricePerUnit,
		order,
		handleBuyFraction,
		address,
		hypercertId,
	);

	if (!isConnected && !address) {
		return (
			<div className="flex flex-col gap-4 p-3">
				<div className="flex flex-col gap-4 justify-center items-center">
					<h4 className="font-bold text-center">
						Connect your wallet to support this report
					</h4>
					<ConnectButton />
				</div>
			</div>
		);
	}

	return (
		<section>
			{!isProcessing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<FormField
							control={form.control}
							name="fractionPayment"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Support amount</FormLabel>
									<div className="grid grid-cols-5 gap-4">
										{[5, 10, 20, 50, 100].map((amount) => (
											<Button
												key={amount}
												disabled={amount > Number(dollarAmountNeeded)}
												type="button"
												variant={
													form.watch("fractionPayment") === amount
														? "default"
														: "outline"
												}
												className={cn(
													"flex justify-center items-center h-10 rounded-lg font-bold transition-colors duration-200",
													form.watch("fractionPayment") === amount
														? "bg-vd-beige-600 text-white hover:bg-vd-beige-700"
														: "text-primary hover:bg-vd-beige-200 hover:text-primary",
													amount > Number(dollarAmountNeeded)
														? "cursor-not-allowed disabled:opacity-15"
														: "",
												)}
												onClick={() => form.setValue("fractionPayment", amount)}
											>
												${amount}
											</Button>
										))}
									</div>
									<FormControl>
										<Input
											type="number"
											placeholder="Enter amount"
											{...field}
											className="w-full px-4 py-2 border border-vd-blue-400 rounded-lg"
										/>
									</FormControl>
									<FormDescription>
										Donation amount in $USD | Max ${dollarAmountNeeded}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="comment"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Message (optional)</FormLabel>
									<FormControl>
										<Textarea
											rows={3}
											placeholder="Leave a message with your donation"
											{...field}
											className="w-full px-4 py-2 border rounded-lg resize-none"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="hideName"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between">
									<div className="space-y-0.5">
										<FormLabel>Hide my name from the donation</FormLabel>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="hideAmount"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between">
									<div className="space-y-0.5">
										<FormLabel>Hide the amount from the donation</FormLabel>
										{/* <FormDescription>
										Choose whether to hide the amount from the donation.
									</FormDescription> */}
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="w-full py-6 flex gap-2" type="submit">
							<Wallet2 />
							Send from wallet
						</Button>
					</form>
				</Form>
			)}
			{isProcessing && (
				<TransactionStatus
					statusContent={transactionStatusContent[transactionStatus]}
					transactionHash={transactionHash}
				/>
			)}
		</section>
	);
};

export default SupportReportForm;
