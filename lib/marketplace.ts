import "server-only";

import { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import { sepolia } from "viem/chains";

import type { Order, Report } from "@/types";
import { useEthersProvider } from "@/hooks/use-ethers-provider";
import { useEthersSigner } from "@/hooks/use-ethers-signer";

let orders: (Order | null)[] | null = null;

let hypercertExchangeClient: HypercertExchangeClient | null = null;

/**
 * Fetches the order corresponding to the given hypercert ID.
 * @param hypercertId The hypercert ID.
 * @returns A promise that resolves to the order.
 */
export async function fetchOrder(hypercertId: string): Promise<Order | null> {
	const hypercertExchangeClient = getHypercertExchangeClient();

	const response = await hypercertExchangeClient.api.fetchOrdersByHypercertId({
		hypercertId: hypercertId,
	});

	if (response.data && response.data.length > 0) {
		if (response.data.length > 1) {
			console.warn(
				`[server] ${response.data.length} orders found for hypercert ${hypercertId}`,
			);
		}
		// Assuming there is only one item per order for the VoiceDeck use case
		return { hypercertId, ...response.data[0] } as Order;
	}
	return null;
}

/**
 * Fetches all orders of impact reports from the Hypercerts marketplace.
 * @param reports The impact reports.
 * @returns A promise that resolves to an array of orders.
 */
export async function getOrders(reports: Report[]): Promise<(Order | null)[]> {
	try {
		if (orders) {
			console.log(
				"[server] Hypercert orders already exist, no need to fetch from remote",
			);
			console.log(`[server] existing Hypercert orders: ${orders.length}`);
		} else {
			// TODO: remove this when we don't need dummy order
			if (process.env.NEXT_PUBLIC_DEPLOY_ENV === "production") {
				// fetch only orders for reports that are not fully funded
				orders = await Promise.all(
					reports.map((report) =>
						report.fundedSoFar < report.totalCost
							? fetchOrder(report.hypercertId)
							: null,
					),
				);
				console.log(`[server] fetched orders: ${orders.length}`);
			} else {
				// fetch only orders for reports that are not fully funded
				orders = await Promise.all(
					reports.map((report) =>
						report.fundedSoFar < report.totalCost
							? fetchOrder(
									"0xa16dfb32eb140a6f3f2ac68f41dad8c7e83c4941-39472754562828861761751454462085112528896",
							  )
							: null,
					),
				);
				console.log(
					`[server] fetched orders: ${
						orders.filter((order) => order !== null).length
					}`,
				);
			}
		}

		return orders;
	} catch (error) {
		console.error(`[server] Failed to fetch orders: ${error}`);
		throw new Error(`[server] Failed to fetch orders: ${error}`);
	}
}

/**
 * Retrieves the singleton instance of the getHypercertExchangeClient.
 */
export const getHypercertExchangeClient = (): HypercertExchangeClient => {
	const provider = useEthersProvider();
	const signer = useEthersSigner();

	if (!provider) {
		throw new Error("No provider found");
	}

	if (!signer) {
		throw new Error("No signer found");
	}

	if (hypercertExchangeClient) {
		return hypercertExchangeClient;
	}

	hypercertExchangeClient = new HypercertExchangeClient(
		sepolia.id,
		// @ts-ignore
		provider as unknown as Provider,
		// @ts-ignore
		signer,
	);

	return hypercertExchangeClient;
};
