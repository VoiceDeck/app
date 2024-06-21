"use client";

import { useFetchHypercertFractionsByHypercertId } from "@/components/marketplace/create-fractional-sale-form";
import { ListForSaleForm } from "@/components/marketplace/list-for-sale-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHypercertClient } from "@/hooks/use-hypercerts-client";
import { useFetchMarketplaceOrdersForHypercert } from "@/marketplace/hooks";
import { parseClaimOrFractionId } from "@hypercerts-org/sdk";
import { useState } from "react";
import type { Address } from "viem";
import { useAccount } from "wagmi";

// TODO: Lots of ts-ignores here, need to fix after update Hypercerts SDK

type Props = {
	hypercertId: string;
	text?: string;
	onClickViewListings?: () => void;
	onClick?: () => void;
};

type FractionPlaceholder = {
	creation_block_timestamp: number;
	fraction_id: string;
	last_block_update_timestamp: number;
	owner_address: Address;
	units: string;
	percentage: number;
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
			// @ts-ignore
			(fraction) => fraction.owner_address === address,
		);

		if (!fractionsOwnedByUser.length) {
			return "You do not own any fractions of this hypercert";
		}

		const fractionsWithoutOrder = fractionsOwnedByUser.filter(
			// @ts-ignore
			(fraction) =>
				!marketplaceOrders?.find(
					(order) =>
						order.itemIds[0] ===
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						parseClaimOrFractionId(fraction.fraction_id!).id.toString(),
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
					<TooltipTrigger>
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
