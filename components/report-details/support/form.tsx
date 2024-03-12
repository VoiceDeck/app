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
import { useEthersProvider } from "@/hooks/use-ethers-provider";
import { useEthersSigner } from "@/hooks/use-ethers-signer";
import { processNewContribution } from "@/lib/directus";
import { cn } from "@/lib/utils";
import type { Report } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { waitForTransactionReceipt } from "viem/actions";
import { sepolia } from "viem/chains";
import { useAccount, usePublicClient } from "wagmi";
import { z } from "zod";

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
	const provider = useEthersProvider({ chainId });
	const signer = useEthersSigner({ chainId });
	const publicClient = usePublicClient({ chainId });
	const { dollarAmountNeeded, pricePerUnit } = useFunding();
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
	const HCExchangeClient = new HypercertExchangeClient(
		chainId ?? sepolia.id,
		// @ts-ignore
		provider,
		signer,
	);

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
	console.log({ order, orders });

	const handleBuyFraction = async (amount: number) => {
		if (!publicClient) {
			console.error("No public client found");
			return;
		}
		if (!order) {
			console.error("No order found");
			return;
		}

		console.log({
			order,
			address,
			amount,
			orderPrice: order.price,
		});

		const takerOrder = HCExchangeClient.createFractionalSaleTakerBid(
			order,
			address,
			amount,
			order.price,
		);

		try {
			setIsProcessing(true);
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
			setIsProcessing(false);
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
			console.info("Awaiting confirmation", tx);
			const txnReceipt = await waitForTransactionReceipt(publicClient, {
				hash: tx.hash as `0x${string}`,
			});
			console.log({ txnReceipt });
			setIsProcessing(false);
			return txnReceipt;
		} catch (e) {
			console.error(e);
			setIsProcessing(false);
		}
	};

	async function onSubmit(values: z.infer<typeof fractionSaleFormSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values, { unitsBought: values.fractionPayment / pricePerUnit });
		// form.reset();
		const unitsToBuy = values.fractionPayment / pricePerUnit;
		handleBuyFraction(unitsToBuy)
			.then((txnReceipt) => {
				if (txnReceipt) {
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
							<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
							<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
					{/* <section className="flex flex-col gap-4 bg-vd-beige-100 rounded-md p-3">
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
					</section> */}
					<div className="flex w-full">
						<Button className="w-full py-6" type="submit">
							Support this report
						</Button>
						{/* {isProcessing && ( */}
						{/* <SupportProcessingDrawer container={drawerContainer} /> */}
						{/* )} */}
					</div>
				</form>
			</Form>
		</section>
	);
};

export default SupportReportForm;
