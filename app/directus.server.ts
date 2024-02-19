import {
	DirectusClient,
	RestClient,
	createDirectus,
	createItem,
	readItem,
	readItems,
	rest,
} from "@directus/sdk";
import { http, Hash, PublicClient, createPublicClient } from "viem";
import { sepolia } from "viem/chains";

import { CMSContent, Contribution } from "./types";

// represents contents retrieved from CMS `reports` collection
let reports: CMSContent[] | null = null;

// biome-ignore lint/suspicious/noExplicitAny: type definition imported from @directus/sdk
let directusClient: (DirectusClient<any> & RestClient<any>) | null = null;
let viemClient: PublicClient | null = null;

/**
 * Processes a new contribution by waiting for a transaction to be included in a block,
 * checking the transaction status, and creating a contribution record if successful.
 *
 * @param txId The hash of the transaction to be processed.
 * @param hypercertId The identifier of the hypercert associated with the contribution.
 * @param amount The amount of the contribution.
 */
export async function processNewContribution(
	txId: Hash,
	hypercertId: string,
	amount: number,
) {
	try {
		console.log(
			`[Viem] waiting for tx ${txId} to be included in a block . . .`,
		);
		const txReceipt = await getViemClient().waitForTransactionReceipt({
			hash: txId,
		});
		console.log(`[Viem] tx ${txId} included in block ${txReceipt.blockNumber}`);

		// if the transaction is reverted, do not create a contribution
		if (txReceipt.status === "reverted") {
			console.log(
				`[Viem] tx ${txId} reverted, skipping contribution creation in Directus`,
			);
			return;
		}

		createContribution({
			sender: txReceipt.from,
			hypercert_id: hypercertId,
			amount: amount,
			txid: txId,
		} as Contribution);
	} catch (error) {
		console.error(`[server] failed to process new contribution: ${error}`);
		throw new Error(`[server] failed to process new contribution: ${error}`);
	}
}

export async function createContribution(contribution: Contribution) {
	const user = {
		address: contribution.sender,
	};
	const client = getDirectusClient();

	try {
		try {
			const response = await client.request(readItem("users", user.address));
			console.log(
				`[Directus] user ${user.address} exist: ${
					response.address === user.address ? "true" : "false"
				}`,
			);
		} catch (err) {
			// Directus throws error with 403 FORBIDDEN when item is not exist to prevent leaking which items exist

			// creating user first before creating contribution because user is a foreign key in contribution
			console.log(`creating user ${user.address} . . .`);
			await client.request(createItem("users", user));
			console.log(`user ${user.address} created successfully`);
		}

		console.log(`[Directus] creating contribution ${contribution.txid} . . .`);
		console.log(` - hypercert_id: ${contribution.hypercert_id}`);
		console.log(` - sender: ${contribution.sender}`);
		console.log(` - amount: ${contribution.amount}`);
		await client.request(createItem("contributions", contribution));
		console.log(
			`[Directus] contribution ${contribution.txid} created successfully`,
		);
	} catch (error) {
		console.error("[Directus] failed to create contribution: ", error);
		throw new Error(`[Directus] failed to create contribution: ${error}`);
	}
}

/**
 * Fetches the contents of the CMS `reports` collection.
 * @returns A promise that resolves to an array of CMS contents.
 * @throws Will throw an error if the CMS contents cannot be fetched.
 */
export const getReports = async (): Promise<CMSContent[]> => {
	const client = getDirectusClient();

	try {
		if (reports) {
			console.log(
				"[Directus] CMS contents already exist, no need to fetch from remote",
			);
			console.log(`[Directus] Existing CMS contents: ${reports.length}`);
		} else {
			console.log("[Directus] Fetching CMS contents from remote");
			const response = await client.request(readItems("reports"));
			reports = response as CMSContent[];
			console.log("[Directus] fetched CMS contents: ", reports.length);
		}

		return reports;
	} catch (error) {
		console.error(`[Directus] Failed to fetch CMS contents: ${error}`);
		throw new Error(`[Directus] Failed to fetch CMS contents: ${error}`);
	}
};

/**
 * Retrieves the singleton instance of the DirectusClient.
 */
// biome-ignore lint/suspicious/noExplicitAny: type definition imported from @directus/sdk
export const getDirectusClient = (): DirectusClient<any> & RestClient<any> => {
	if (directusClient) {
		return directusClient;
	}

	if (!process.env.CMS_ENDPOINT) {
		throw new Error("[server] CMS_ENDPOINT environment variable is not set");
	}
	try {
		directusClient = createDirectus(process.env.CMS_ENDPOINT).with(rest());
	} catch (error) {
		console.error(
			`[server] Failed to create Directus client using endpoint ${process.env.CMS_ENDPOINT}: ${error}`,
		);
		throw new Error(
			`[server] failed to create Directus client using endpoint ${process.env.CMS_ENDPOINT}: ${error}`,
		);
	}

	return directusClient;
};

/**
 * Retrieves the singleton instance of the viemClient.
 */
export const getViemClient = (): PublicClient => {
	if (viemClient) {
		return viemClient;
	}

	viemClient = createPublicClient({
		chain: sepolia,
		transport: http(),
	});

	return viemClient;
};
