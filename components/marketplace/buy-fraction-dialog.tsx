"use client";
import { StepProcessDialogProvider } from "@/components/global/step-process-dialog";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import type { MarketplaceOrder } from "@/marketplace/types";
import React from "react";
import { BuyFractionalOrderForm } from "./buy-fractional-order-form";

const BuyFractionDialog = ({
	selectedOrder,
}: { selectedOrder: MarketplaceOrder }) => {
	return (
		<DialogContent>
			<DialogHeader>Buy fractional sale</DialogHeader>
			<StepProcessDialogProvider>
				<BuyFractionalOrderForm order={selectedOrder} />
			</StepProcessDialogProvider>
		</DialogContent>
	);
};

export default BuyFractionDialog;
