"use client";
import ConnectButton from "@/components/connect-button";
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
import { processNewContribution } from "@/lib/directus";
import { cn } from "@/lib/utils";
import type { Report } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import { useQuery } from "@tanstack/react-query";
import {
	AlertTriangle,
	ArrowUpRight,
	CheckCircle,
	Loader2,
	Wallet2,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Address } from "viem";
import { sepolia } from "viem/chains";
import { useAccount, usePublicClient } from "wagmi";
import { z } from "zod";

interface SupportReportFormProps {
	drawerContainer: HTMLDivElement | null;
	hypercertId: Partial<Report>["hypercertId"];
}

const transactionStatusContent: Record<
	keyof typeof TransactionStatuses,
	{ icon: JSX.Element; title: string; content: string }
> = {
	Pending: {
		icon: <Loader2 size={36} />,
		title: "Just a moment! We're working on it.",
		content: "We're connecting to your wallet to process the transaction.",
	},
	Failed: {
		icon: <AlertTriangle size={36} />,
		title: "Sorry! There was an issue.",
		content:
			"We ran into a problem while processing the transaction. Could you try again?",
	},
	Confirmed: {
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
	const provider = useEthersProvider({ chainId });
	const signer = useEthersSigner({ chainId });
	const publicClient = usePublicClient({ chainId });
	const { dollarAmountNeeded, pricePerUnit } = useFunding();
	const [transactionHash, setTransactionHash] = useState<Address | null>(null);
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const fractionSaleFormSchema = z.object({
		fractionPayment: z.coerce.number().min(1).max(Number(dollarAmountNeeded)),
		comment: z.string(),
		hideName: z.boolean(),
		hideAmount: z.boolean(),
	});

	const form = useForm<z.infer<typeof fractionSaleFormSchema>>({
		resolver: zodResolver(fractionSaleFormSchema),
		defaultValues: {
			fractionPayment: 1,
			comment: "",
			hideName: false,
			hideAmount: false,
		},
	});
	const HCExchangeClient = new HypercertExchangeClient(
		chainId ?? sepolia.id,
		// @ts-ignore
		provider,
		signer,
	);

	const { handleBuyFraction, transactionStatus } = useHandleBuyFraction(
		publicClient,
		HCExchangeClient,
	);

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
				"0xa16dfb32eb140a6f3f2ac68f41dad8c7e83c4941-39472754562828861761751454462085112528896",
				// "0xa16dfb32eb140a6f3f2ac68f41dad8c7e83c4941-67375908650345815765748172271490105868288",
				chainId,
			),
	});

	if (isOrdersPending) return "Loading...";

	if (orderError) return `An error has occurred: ${orderError.message}`;

	const order = orders?.[5];
	// console.log({ order, orders });

	async function onSubmit(values: z.infer<typeof fractionSaleFormSchema>) {
		setIsProcessing(true);
		// console.log(values, { unitsBought: values.fractionPayment / pricePerUnit });
		form.reset();
		const unitsToBuy = values.fractionPayment / pricePerUnit;
		handleBuyFraction(order, unitsToBuy, address)
			.then((txnReceipt) => {
				if (txnReceipt) {
					setTransactionHash(txnReceipt.transactionHash);
					console.log("Processing new contribution in CMS");
					processNewContribution(
						txnReceipt.transactionHash,
						hypercertId ?? "",
						unitsToBuy,
						values.comment,
					);
				}
			})
			.catch((e) => console.error(e));
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
											<button
												key={amount}
												disabled={amount > Number(dollarAmountNeeded)}
												type="button"
												className={cn(
													"flex justify-center items-center h-10 rounded-lg border-[1.5px] font-bold hover:bg-vd-beige-200 transition-colors duration-200 text-primary hover:text-primary disabled:opacity-15",
													form.watch("fractionPayment") === amount
														? "bg-vd-beige-600 text-white"
														: "bg-transparent text-primary",
													amount > Number(dollarAmountNeeded)
														? "cursor-not-allowed"
														: "",
												)}
												onClick={() => form.setValue("fractionPayment", amount)}
											>
												${amount}
											</button>
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
									{/* <FormDescription>
									Leave a message with your donation (optional).
								</FormDescription> */}
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
										{/* <FormDescription>
										Choose whether to hide your name from the donation.
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
				<div
					className={cn(
						"flex flex-col gap-2 p-4 rounded-md bg-vd-beige-100 border-vd-beige-200 border-2",
					)}
				>
					<div
						className={cn("flex justify-center", {
							"animate-spin": transactionStatus === "Pending",
						})}
					>
						{transactionStatusContent[transactionStatus].icon}
					</div>
					<div className="flex flex-col gap-4">
						<h4 className="font-bold text-lg text-center">
							{transactionStatusContent[transactionStatus].title}
						</h4>
						<p className="text-center">
							{transactionStatusContent[transactionStatus].content}
						</p>
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
					{transactionStatus !== "Pending" && (
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
			)}
		</section>
	);
};

export default SupportReportForm;
