import 'server-only'

import { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import { ethers } from "ethers";
import { sepolia } from "viem/chains";

import type { Order, Report } from "@/types";

let orders: (Order | null)[] | null = null;

let hypercertExchangeClient: HypercertExchangeClient | null = null;

const provider = new ethers.JsonRpcProvider(
  process.env.ETHEREUM_RPC_URL as string
);

// here we use placeholder private key for the signer because we are not actually signing any transactions
const signer = new ethers.Wallet(
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  provider
);

/**
 * Fetches the order corresponding to the given hypercert ID.
 * @param hypercertId The hypercert ID.
 * @returns A promise that resolves to the order.
 */
export async function fetchOrder(tokenId: string): Promise<Order | null> {
	const hypercertExchangeClient = getHypercertExchangeClient();

  console.log(`[server] fetching order of tokenId ${tokenId}`);
	const response = await hypercertExchangeClient.api.fetchOrders(
    {
      claimTokenIds: [tokenId],
    }
  );
	
  if (response.data && response.data.length > 0) {
    if (response.data.length > 1) {
      console.warn(
        `[server] ${response.data.length} orders found for hypercert ${tokenId}`
      );
    }
    // Assuming there is only one item per order for the VoiceDeck use case
    return response.data[0] as Order;
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
    // fetch only orders for reports that are not fully funded
    orders = await Promise.all(
      reports.map((report) =>
        report.fundedSoFar < report.totalCost
          ? fetchOrder(report.tokenID)
          : null
      )
    );

    const nonNullOrders = orders.filter(order => order !== null);
    console.log(`[server] fetched orders: ${nonNullOrders.length}`);
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
  if (hypercertExchangeClient) {
    return hypercertExchangeClient;
  }

  hypercertExchangeClient = new HypercertExchangeClient(
    sepolia.id,
    provider,
    signer
  );

  return hypercertExchangeClient;
};
