"use client";
import React from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SellFractionsForm } from "@/components/profile/sell-fractions-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Address } from "viem";
import { useAccount } from "wagmi";

const SellFractionsDialog = ({ owner_address }: { owner_address: Address }) => {
	const { address } = useAccount();
	if (!address || address !== owner_address) {
		return null;
	}
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size={"sm"} variant={"outline"}>
					List for sale
				</Button>
			</DialogTrigger>

			<DialogContent className="w-auto p-0">
				<Card className="border-none bg-vd-beige-100 shadow-none">
					<CardHeader>
						<CardTitle>List for sale</CardTitle>
						<CardDescription>
							You can create a fraction sale for your hypercert so that the
							buyer can decide how many units they want to buy.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<SellFractionsForm />
					</CardContent>
				</Card>
			</DialogContent>
		</Dialog>
	);
};

export { SellFractionsDialog };
