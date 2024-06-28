import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { truncateEthereumAddress } from "@/lib/utils";
import { getOpenOrders } from "@/marketplace/getOpenOrders";
import React from "react";
import type { Address } from "viem";
import { decodeAbiParameters, formatEther, parseAbiParameters } from "viem";
import EthAddress from "../eth-address";
import { SupportReport } from "../report-details/support/dialog";
import { Button } from "../ui/button";

const parseAdditionalParameters = (additionalParameters: Address) => {
	const [unitAmount, maxUnitsToBuy] = decodeAbiParameters(
		parseAbiParameters("uint256 a, uint256 b, uint256 c, uint256 d"),
		additionalParameters,
	);
	return {
		unitAmount: unitAmount.toString(),
		maxUnitsToBuy: maxUnitsToBuy.toString(),
	};
};

async function BuyFraction({ hypercertId }: { hypercertId: string }) {
	const orders = await getOpenOrders(hypercertId);
	console.log("Orders Data:", orders);
	if (!orders || orders.length === 0) {
		return (
			<Card className="bg-gray-100 shadow-none">
				<CardHeader>
					<CardTitle className="px-8 text-center text-zinc-500">
						When this hypercert is listed on the marketplace, you will be able
						to buy it here.
					</CardTitle>
				</CardHeader>
			</Card>
		);
	}

	const { unitAmount, maxUnitsToBuy } = parseAdditionalParameters(
		orders[0].additionalParameters as Address,
	);
	// console.log("Orders Data:", data);
	return (
		<Card className="max-w-[500px] shadow-none">
			<CardHeader>
				<CardTitle className="text-zinc-500">
					Sold by: {truncateEthereumAddress(orders[0].signer as Address)}
				</CardTitle>
				<CardDescription>
					To support this contribution, buy a fraction of the hypercert.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex justify-between gap-2">
				<div className="flex flex-col items-center justify-between">
					<p className="font-bold text-sm">Min units to buy:</p>
					<data className="text-xs">{unitAmount}</data>
				</div>
				<div className="flex flex-col items-center justify-between">
					<p className="font-bold text-sm">Max units to buy:</p>
					<data className="text-xs">{maxUnitsToBuy}</data>
				</div>
				<div className="flex flex-col items-center justify-between">
					<p className="font-bold text-sm">Price per unit</p>
					<data className="text-xs">
						{formatEther(BigInt(orders[0].price))} ETH
					</data>
				</div>
			</CardContent>
			<CardFooter className="flex justify-end">
				<Button className="w-28">Buy</Button>
			</CardFooter>
			{/* <SupportReport hypercertId={hypercertId} image={image} title={name} /> */}
		</Card>
	);
}

export default BuyFraction;
