import {
	Card,
	CardContent,
	CardDescription,
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
			<Card className="max-w-[500px] bg-vd-beige-100 shadow-none">
				<CardHeader>
					<CardTitle className="px-8 text-center text-vd-beige-600">
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
		<Card className="max-w-[500px] bg-vd-beige-100 shadow-none">
			<CardHeader>
				<CardTitle className="text-vd-beige-600">
					Sold by: {truncateEthereumAddress(orders[0].signer as Address)}
				</CardTitle>
				<CardDescription className="text-center">
					<div className="flex justify-between">
						<div className="text-sm">
							Price per unit: {formatEther(BigInt(orders[0].price))} ETH
						</div>
						<div className="text-sm">Min units to buy: {unitAmount}</div>
						<div className="text-sm">Max units to buy: {maxUnitsToBuy}</div>
					</div>
				</CardDescription>
			</CardHeader>
			{/* <SupportReport hypercertId={hypercertId} image={image} title={name} /> */}
		</Card>
	);
}

export default BuyFraction;
