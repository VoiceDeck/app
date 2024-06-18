"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { parseClaimOrFractionId } from "@hypercerts-org/sdk";

import { useHypercertClient } from "@/hooks/use-hypercerts-client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ListForSaleForm } from "@/components/marketplace/list-for-sale-form";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFetchHypercertFractionsByHypercertId } from "@/components/marketplace/create-fractional-sale-form";
import { useFetchMarketplaceOrdersForHypercert } from "@/marketplace/hooks";

type Props = {
	hypercertId: string;
	text?: string;
	onClickViewListings?: () => void;
	onClick?: () => void;
};

export function ListForSaleButton({
	hypercertId,
	text = "List for sale",
	onClickViewListings,
	onClick,
	...props
}: Props) {
	const [isOpen, setIsOpen] = useState(false);

	const onClickButton = () => {
		onClick?.();
		setIsOpen(true);
	};

	const { isConnected, address } = useAccount();
	const { client } = useHypercertClient();

	const disabled =
		!client || !client.isClaimOrFractionOnConnectedChain(hypercertId);

	const { data: fractions } =
		useFetchHypercertFractionsByHypercertId(hypercertId);
	const { data: marketplaceOrders } =
		useFetchMarketplaceOrdersForHypercert(hypercertId);

	if (!fractions) {
		return null;
	}

	const getToolTipMessage = () => {
		if (!isConnected || !address) {
			return "Please connect your wallet to use the marketplace";
		}

		if (!client) {
			return "Hypercert client is not connected";
		}

		if (!client.isClaimOrFractionOnConnectedChain(hypercertId)) {
			return "This hypercert is not on the connected chain";
		}

		const fractionsOwnedByUser = fractions.filter(
			(fraction) => fraction.owner_address === address,
		);

		if (!fractionsOwnedByUser.length) {
			return "You do not own any fractions of this hypercert";
		}

		const fractionsWithoutOrder = fractionsOwnedByUser.filter(
			(fraction) =>
				!marketplaceOrders?.find(
					(order) =>
						order.itemIds[0] ===
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						parseClaimOrFractionId(fraction.hypercert_id!).id.toString(),
				),
		);

		if (!fractionsWithoutOrder.length) {
			return "All your fractions are already listed for sale";
		}

		return null;
	};

	const tooltipMessage = getToolTipMessage();

	if (tooltipMessage) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild className="cursor-not-allowed">
						<div>
							<Button disabled {...props}>
								{text}
							</Button>
						</div>
					</TooltipTrigger>
					<TooltipContent>{tooltipMessage}</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return (
		<>
			<Button
				disabled={disabled}
				variant="outline"
				onClick={onClickButton}
				{...props}
			>
				{text}
			</Button>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent>
					<ListForSaleForm hypercertId={hypercertId} />
				</DialogContent>
			</Dialog>
		</>
	);
}

ListForSaleButton.displayName = "ListForSaleButton";
