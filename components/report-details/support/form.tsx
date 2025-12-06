"use client";
import { ConnectButton } from "@/components/global/connect-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_CHAIN_ID } from "@/config/constants";
import { useFunding } from "@/contexts/funding-context";
import {
	type PaymentType,
	type TransactionStatuses,
	useHandleBuyFraction,
} from "@/hooks/use-buy-fraction";
import { useEthersProvider } from "@/hooks/use-ethers-provider";
import { useEthersSigner } from "@/hooks/use-ethers-signer";
import useSupportForm from "@/hooks/use-support-form";
import { getOrderByHypercertId } from "@/hypercerts/getOrderByHypercertId";
import { cn } from "@/lib/utils";
import type { Report } from "@/types";
import { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import { useWallets } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import {
	AlertTriangle,
	ArrowUpRight,
	CheckCircle,
	Loader2,
	Wallet2,
} from "lucide-react";
import { useState } from "react";
import { sepolia } from "viem/chains";
import { useAccount, usePublicClient } from "wagmi";
import TransactionStatus from "./transaction-status";

interface SupportReportFormProps {
	hypercertId: Partial<Report>["hypercertId"];
	reportTitle?: string;
	reportImage?: string;
	slug?: string;
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
	PreparingOrder: {
		label: "PreparingOrder",
		icon: <Loader2 size={36} />,
		title: "Preparing your order..",
		content: "We're preparing your order to be processed..",
	},
	SignForBuy: {
		label: "SignForBuy",
		icon: <Loader2 size={36} />,
		title: "Waiting for your signature..",
		content: "Please sign for your order to be processed..",
	},
	Approval: {
		label: "Approval",
		icon: <Loader2 size={36} />,
		title: "Waiting for your approval..",
		content:
			"We're asking for your permission to spend funds from your wallet..",
	},
	Pending: {
		label: "Pending",
		icon: <Loader2 size={36} />,
		title: "Processing..",
		content: "We're processing your transaction on-chain..",
	},
	Failed: {
		label: "Failed",
		icon: <AlertTriangle size={36} className="text-red-500" />,
		title: "Sorry! There was an issue.",
		content:
			"We ran into a problem while processing the transaction. Could you try again?",
	},
	Confirmed: {
		label: "Confirmed",
		icon: <CheckCircle size={36} />,
		title: "Thank you! We got your support.",
		content:
			"Your transaction was successful. We're grateful for your contribution! It might take a few minutes to show up on the report.",
	},
	InsufficientFunds: {
		label: "InsufficientFunds",
		icon: <AlertTriangle size={36} className="text-red-500" />,
		title: "Check your funds",
		content: "Make sure you've got enough ETH to complete the transaction",
	},
	ActionRejected: {
		label: "ActionRejected",
		icon: <AlertTriangle size={36} className="text-red-500" />,
		title: "Transaction rejected",
		content: "You rejected the transaction. Please try again.",
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
		console.log(hypercertId, "hypercertId");
		const { orders } = await getOrderByHypercertId(hypercertId);
		console.log({ orders }, "orders");
		return orders;
	} catch (error) {
		console.error("[Fetching orders] - Error fetching orders", error);
		return [];
	}
}

const SupportReportForm = ({
	hypercertId,
	reportImage,
	reportTitle,
	slug,
}: SupportReportFormProps) => {
	const { address, isConnected, chainId } = useAccount();
	const { wallets, ready } = useWallets();
	const wallet = wallets[0];
	const provider = useEthersProvider({ chainId });
	const signer = useEthersSigner({ chainId });
	const publicClient = usePublicClient({ chainId });
	const { dollarAmountNeeded, pricePerUnit } = useFunding();
	const [isProcessingFiat, setIsProcessingFiat] = useState(false);

	const HCExchangeClient = new HypercertExchangeClient(
		chainId ?? sepolia.id,
		// @ts-ignore
		provider,
		signer ??
			ethers.Wallet.createRandom(
				provider ? (provider as unknown as ethers.Provider) : null,
			),
	);

	console.log({ HCExchangeClient });
	const [paymentMethod, setPaymentMethod] = useState<PaymentType | null>(null);

	const { handleBuyFraction, transactionStatus, transactionHash } =
		useHandleBuyFraction(publicClient, HCExchangeClient);

	const {
		isPending: isOrdersPending,
		error: orderError,
		data: orders,
	} = useQuery({
		queryKey: ["ordersFromHypercert"],
		queryFn: () =>
			getOrdersForReport(HCExchangeClient, hypercertId, DEFAULT_CHAIN_ID),
	});
	console.log("orders", orders);

	const { address: addr } = useAccount();
	console.log("addressss", addr);
	const handleSubmit = (event: React.FormEvent) => {
		if (reportImage) {
			form.setValue("images", [reportImage]);
		}
		event.preventDefault();
		if (!paymentMethod) return;
		form.setValue("paymentType", paymentMethod);
		if (paymentMethod === "crypto") {
			form.handleSubmit(onSubmit)();
		} else if (paymentMethod === "fiat-with-login") {
			form.setValue("paymentType", "fiat-with-login");
			form.setValue("name", reportTitle);
			form.handleSubmit(onSubmit)();
		} else if (paymentMethod === "fiat-without-login") {
			setIsProcessingFiat(true);
			form.setValue("paymentType", "fiat-without-login");
			form.setValue("name", reportTitle);
			form.handleSubmit(onSubmit)();
		}
	};

	const { form, onSubmit, isProcessing } = useSupportForm(
		Number(dollarAmountNeeded),
		pricePerUnit,
		// TODO: remove this when we don't need dummy order
		process.env.NEXT_PUBLIC_DEPLOY_ENV === "production"
			? orders?.[0]
			: orders?.[5],
		handleBuyFraction,
		address,
		hypercertId,
		slug,
	);
	if (!ready || isOrdersPending) {
		return <h1>Loading...</h1>;
	}

	if (!isConnected && !address) {
		return (
			<div className="flex flex-col gap-6 p-4 w-full overflow-hidden">
				{/* Primary Option: Direct Donation */}
				<div className="space-y-4">
					<h4 className="font-bold text-lg text-center text-vd-blue-900">
						Support with Email & Card
					</h4>
					<Form {...form}>
						<form
							className="flex flex-col gap-4 w-full"
							onSubmit={handleSubmit}
						>
							<FormField
								control={form.control}
								name="fractionPayment"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Support amount</FormLabel>
										<div className="grid grid-cols-5 gap-2 sm:gap-4">
											{[5, 10, 20, 50, 100].map((amount) => (
												<Button
													key={Math.trunc(amount)}
													disabled={amount > Number(dollarAmountNeeded)}
													type="button"
													variant={
														form.watch("fractionPayment") === amount
															? "default"
															: "outline"
													}
													className={cn(
														"flex justify-center items-center h-10 sm:h-12 rounded-lg font-bold transition-colors duration-200 touch-manipulation",
														form.watch("fractionPayment") === amount
															? "bg-vd-beige-600 text-white hover:bg-vd-beige-700"
															: "text-primary hover:bg-vd-beige-200 hover:text-primary",
														amount > Number(dollarAmountNeeded)
															? "cursor-not-allowed disabled:opacity-15"
															: "",
													)}
													onClick={() => {
														form.setValue("fractionPayment", amount);
														// Slight delay to ensure the value is set before potential scroll
														setTimeout(() => {
															const emailField = document.querySelector(
																'input[type="email"]',
															);
															if (emailField && window.innerWidth < 768) {
																emailField.scrollIntoView({
																	behavior: "smooth",
																	block: "center",
																});
															}
														}, 100);
													}}
												>
													${amount}
												</Button>
											))}
										</div>
										<FormControl>
											<Input
												type="number"
												step="1"
												min="1"
												placeholder="Enter amount"
												{...field}
												className="w-full px-4 py-3 text-base border border-vd-blue-400 rounded-lg touch-manipulation overflow-hidden"
												onInput={(e) => {
													// Prevent decimal input by removing any decimal points
													const target = e.target as HTMLInputElement;
													target.value = target.value.replace(/[.,]/g, "");
												}}
											/>
										</FormControl>
										<FormDescription className="text-center">
											Choose your donation amount • Max ${dollarAmountNeeded}
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								rules={{
									required: "Email is required",
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: "Invalid email address",
									},
								}}
								render={({ field }) => (
									<FormItem>
										<div className="flex items-center gap-2 mb-2">
											<svg
												width="18"
												height="18"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												role="img"
												aria-label="Email icon"
											>
												<path
													d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
													stroke="currentColor"
													strokeWidth="2"
													fill="none"
												/>
												<polyline
													points="22,6 12,13 2,6"
													stroke="currentColor"
													strokeWidth="2"
													fill="none"
												/>
											</svg>
											<span className="font-medium text-vd-blue-700">
												Email Address
											</span>
										</div>
										<FormControl>
											<Input
												type="email"
												placeholder="your.email@example.com"
												{...field}
												className="w-full h-12 px-4 py-2 text-base sm:text-lg border-2 border-vd-blue-400 rounded-lg focus:border-vd-blue-600 touch-manipulation overflow-hidden"
												onFocus={(e) => {
													// Ensure the input is visible on mobile
													if (window.innerWidth < 768) {
														setTimeout(() => {
															e.target.scrollIntoView({
																behavior: "smooth",
																block: "center",
															});
														}, 300);
													}
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="comment"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<svg
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												role="img"
												aria-label="Message icon"
											>
												<path
													d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
													stroke="currentColor"
													strokeWidth="2"
													fill="none"
												/>
											</svg>
											Message (optional)
										</FormLabel>
										<FormControl>
											<Textarea
												rows={3}
												placeholder="Leave a message with your donation..."
												{...field}
												className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg resize-none bg-gray-50 focus:border-vd-blue-600 focus:bg-white touch-manipulation overflow-hidden"
												onFocus={(e) => {
													// Ensure the textarea is visible on mobile
													if (window.innerWidth < 768) {
														setTimeout(() => {
															e.target.scrollIntoView({
																behavior: "smooth",
																block: "center",
															});
														}, 300);
													}
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								className="w-full h-14 flex gap-3 rounded-lg text-base sm:text-lg font-bold bg-gradient-to-r from-vd-blue-900 to-vd-blue-700 hover:from-vd-blue-700 hover:to-vd-blue-600 touch-manipulation"
								type="submit"
								onClick={() => setPaymentMethod("fiat-without-login")}
								disabled={isProcessingFiat}
							>
								{isProcessingFiat ? (
									<>
										<Loader2 className="animate-spin" size={20} />
										Processing...
									</>
								) : (
									<>
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											role="img"
											aria-label="Credit card icon"
										>
											<rect
												x="1"
												y="4"
												width="22"
												height="16"
												rx="2"
												ry="2"
												stroke="currentColor"
												strokeWidth="2"
												fill="none"
											/>
											<line
												x1="1"
												y1="10"
												x2="23"
												y2="10"
												stroke="currentColor"
												strokeWidth="2"
											/>
										</svg>
										Donate with Credit/Debit Card
									</>
								)}
							</Button>
						</form>
					</Form>
				</div>

				{/* Divider */}
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300" />
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-4 bg-white text-gray-500 font-medium">or</span>
					</div>
				</div>

				{/* Secondary Option: Crypto */}
				<div className="space-y-3">
					<h4 className="font-medium text-center text-gray-700">
						Support with Cryptocurrency
					</h4>
					<ConnectButton />
				</div>

				{/* Security Note */}
				<div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						role="img"
						aria-label="Security shield icon"
					>
						<path
							d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
							stroke="currentColor"
							strokeWidth="2"
							fill="none"
						/>
					</svg>
					<span>Your payment information is secure and encrypted</span>
				</div>
			</div>
		);
	}

	if (orderError || orders?.length === 0) {
		return (
			<div className="flex flex-col gap-4 p-3">
				<div className="flex flex-col gap-4 justify-center items-center">
					<h4 className="font-bold text-center">
						We could't find an order for this report. Please send the link to
						this report to the team!
					</h4>
				</div>
			</div>
		);
	}

	return (
		<section className="w-full overflow-hidden">
			{!isProcessing && (
				<Form {...form}>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
						<FormField
							control={form.control}
							name="fractionPayment"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Support amount</FormLabel>
									<div className="grid grid-cols-5 gap-2 sm:gap-4">
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
													"flex justify-center items-center h-10 sm:h-12 rounded-lg font-bold transition-colors duration-200 touch-manipulation",
													form.watch("fractionPayment") === amount
														? "bg-vd-beige-600 text-white hover:bg-vd-beige-700"
														: "text-primary hover:bg-vd-beige-200 hover:text-primary",
													amount > Number(dollarAmountNeeded)
														? "cursor-not-allowed disabled:opacity-15"
														: "",
												)}
												onClick={() => {
													form.setValue("fractionPayment", amount);
													// Smooth scroll to message field on mobile after selection
													setTimeout(() => {
														const messageField =
															document.querySelector("textarea");
														if (messageField && window.innerWidth < 768) {
															messageField.scrollIntoView({
																behavior: "smooth",
																block: "center",
															});
														}
													}, 100);
												}}
											>
												${amount}
											</Button>
										))}
									</div>
									<FormControl>
										<Input
											type="number"
											// step="1"
											// min="1"
											placeholder="Enter amount"
											{...field}
											className="w-full px-4 py-3 text-base border border-vd-blue-400 rounded-lg touch-manipulation overflow-hidden"
											onInput={(e) => {
												// Prevent decimal input by removing any decimal points
												const target = e.target as HTMLInputElement;
												// target.value = target.value.replace(/[.,]/g, "");
											}}
										/>
									</FormControl>
									<FormDescription className="text-center">
										Choose your donation amount • Max ${dollarAmountNeeded}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2">
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											role="img"
											aria-label="Email icon"
										>
											<path
												d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
												stroke="currentColor"
												strokeWidth="2"
												fill="none"
											/>
											<polyline
												points="22,6 12,13 2,6"
												stroke="currentColor"
												strokeWidth="2"
												fill="none"
											/>
										</svg>
										Enter email for confirmation receipt (optional)
									</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="your.email@example.com"
											{...field}
											className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-vd-blue-600 focus:bg-white touch-manipulation overflow-hidden"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="comment"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2">
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											role="img"
											aria-label="Message icon"
										>
											<path
												d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
												stroke="currentColor"
												strokeWidth="2"
												fill="none"
											/>
										</svg>
										Message (optional)
									</FormLabel>
									<FormControl>
										<Textarea
											rows={3}
											placeholder="Leave a message with your donation..."
											{...field}
											className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg resize-none bg-gray-50 focus:border-vd-blue-600 focus:bg-white touch-manipulation overflow-hidden"
											onFocus={(e) => {
												// Ensure the textarea is visible on mobile
												if (window.innerWidth < 768) {
													setTimeout(() => {
														e.target.scrollIntoView({
															behavior: "smooth",
															block: "center",
														});
													}, 300);
												}
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							className="w-full py-6 flex gap-3 rounded-lg text-base sm:text-lg font-bold bg-gradient-to-r from-vd-blue-900 to-vd-blue-700 hover:from-vd-blue-700 hover:to-vd-blue-600 touch-manipulation"
							type="submit"
							onClick={() => setPaymentMethod("fiat-with-login")}
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								role="img"
								aria-label="Credit card icon"
							>
								<rect
									x="1"
									y="4"
									width="22"
									height="16"
									rx="2"
									ry="2"
									stroke="currentColor"
									strokeWidth="2"
									fill="none"
								/>
								<line
									x1="1"
									y1="10"
									x2="23"
									y2="10"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
							Donate with Card
						</Button>

						<Button
							variant="outline"
							className="w-full py-6 flex gap-2 rounded-lg border-2 border-vd-blue-400 hover:bg-vd-blue-50 touch-manipulation"
							type="submit"
							onClick={() => setPaymentMethod("crypto")}
						>
							<Wallet2 />
							Send from crypto wallet
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
