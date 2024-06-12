// @ts-nocheck
import "server-only";

import {
	type DirectusClient,
	type RestClient,
	createDirectus,
	createItem,
	deleteItem,
	readItem,
	readItems,
	rest,
	staticToken,
} from "@directus/sdk";
import { Mutex } from "async-mutex";
import {
	http,
	type Address,
	type Hash,
	type PublicClient,
	createPublicClient,
	getAddress,
} from "viem";
import { sepolia } from "viem/chains";

import type { CMSContent, Contribution } from "@/types";
import { updateFundedAmount } from "./impact-reports";

// represents contents retrieved from CMS `reports` collection
let CMSReports: CMSContent[] | null = null;

// biome-ignore lint/suspicious/noExplicitAny: type definition imported from @directus/sdk
let directusClient: (DirectusClient<any> & RestClient<any>) | null = null;
let viemClient: PublicClient | null = null;

// cache CMS contents
const users: { [address: Address]: string } = {};
const contributionsByHCId: { [hypercertId: string]: Contribution[] } = {};
const contributionsMutex = new Mutex();

/**
 * Processes a new contribution by waiting for a transaction to be included in a block,
 * checking the transaction status, and creating a contribution record if successful.
 *
 * @param txId The hash of the transaction to be processed.
 * @param hypercertId The identifier of the hypercert associated with the contribution.
 * @param amount The amount of the contribution.
 * @param comment The comment of the contributor to the contribution.
 */
export async function processNewContribution(
	sender: Address,
	txId: Hash,
	hypercertId: string,
	amount: number,
	comment?: string,
) {
	try {
		const client = getDirectusClient();

		// check if the transaction is already processed
		const response = await client.request(
			readItems("contributions", {
				fields: ["txid"],
				filter: {
					txid: {
						_eq: txId,
					},
				},
			}),
		);

		const contribution = {
			sender: getAddress(sender),
			hypercert_id: hypercertId,
			amount: amount,
			txid: txId,
			date_created: new Date().toISOString(),
			comment: comment,
		} as Contribution;
		// create a contribution record in Directus
		await createContribution(contribution);

		// update the funded amount of the hypercert in server memory
		await updateFundedAmount(hypercertId, amount);
		// add the contribution to the cache
		updateContribution(hypercertId, contribution);
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
		console.log(
			` - comment exists: ${contribution.comment ? "true" : "false"}`,
		);
		await client.request(createItem("contributions", contribution));
		console.log(
			`[Directus] contribution ${contribution.txid} created successfully`,
		);
	} catch (error) {
		console.error("[Directus] failed to create contribution: ", error);
		throw new Error(`[Directus] failed to create contribution: ${error}`);
	}
}

export async function removeContribution(txid: Hash) {
	const client = getDirectusClient();

	try {
		console.log(`[Directus] remove contribution of tx ${txid} . . .`);

		await client.request(deleteItem("contributions", txid));
		console.log(`[Directus] contribution of tx ${txid} removed successfully`);
	} catch (error) {
		console.error("[Directus] failed to remove contribution: ", error);
		throw new Error(`[Directus] failed to remove contribution: ${error}`);
	}
}

/**
 * Fetches the contents of the CMS `reports` collection.
 * @returns A promise that resolves to an array of CMS contents.
 * @throws Will throw an error if the CMS contents cannot be fetched.
 */
export const getCMSReports = async (): Promise<CMSContent[]> => {
	const client = getDirectusClient();

	try {
		if (CMSReports) {
			console.log(
				"[Directus] CMS contents already exist, no need to fetch from remote",
			);
			console.log(`[Directus] Existing CMS contents: ${CMSReports.length}`);
		} else {
			console.log("[Directus] Fetching CMS contents from remote");
			const response = await client.request(
				readItems("reports", {
					filter: {
						status: {
							_eq: "published",
						},
					},
				}),
			);
			CMSReports = response as CMSContent[];
			console.log("[Directus] fetched CMS contents: ", CMSReports.length);
		}

		return CMSReports;
	} catch (error) {
		console.error(`[Directus] Failed to fetch CMS contents: ${error}`);
		throw new Error(`[Directus] Failed to fetch CMS contents: ${error}`);
	}
};

/**
 * Retrieves the total funded amount for a given hypercert by its ID.
 * It fetches all contributions related to the hypercert and sums up their amounts.
 *
 * @param hypercertId - The unique identifier of the hypercert.
 * @returns - A promise that resolves to the total funded amount as a number.
 * @throws {Error} - Throws an error if the request to fetch contributions fails.
 */
export const getFundedAmountByHCId = async (
	hypercertId: string,
): Promise<number> => {
	const client = getDirectusClient();

	try {
		const response = await client.request(
			readItems("contributions", {
				fields: ["amount"],
				filter: {
					hypercert_id: {
						_eq: hypercertId,
					},
				},
			}),
		);

		const funded = response.reduce(
			(total, contribution) => total + contribution.amount,
			0,
		);
		return funded;
	} catch (error) {
		console.error(
			`[Directus] Failed to get funded amount for hypercert Id '${hypercertId}': ${error}`,
		);
		throw new Error(
			`[Directus] Failed to get funded amount for hypercert Id '${hypercertId}': ${error}`,
		);
	}
};

/**
 * Retrieves the number of unique contributors from the Directus users collection.
 *
 * @returns - A promise that resolves to the number of contributors.
 * @throws {Error} - Throws an error if the request to fetch the number of contributors fails.
 */
export const getNumberOfContributors = async (): Promise<number> => {
	const client = getDirectusClient();

	try {
		const response = await client.request(
			readItems("users", {
				fields: ["address"],
			}),
		);

		return response.length;
	} catch (error) {
		console.error(`[Directus] Failed to get number of contributors: ${error}`);
		throw new Error(
			`[Directus] Failed to get number of contributors: ${error}`,
		);
	}
};

/**
 * Retrieves a list of contributions associated with a given address.
 * It fetches the user by address and then iterates over the user's contributions,
 * fetching each contribution's details from the 'contributions' collection.
 *
 * @param address - The wallet address to fetch contributions for.
 * @returns - A promise that resolves to an array of contributions.
 * @throws {Error} - Throws an error if fetching contributions fails.
 */
// TODO: Refactor to fetch from hypercerts client
export const getContributionsByAddress = async (
	address: Address,
): Promise<Contribution[]> => {
	const client = getDirectusClient();
	try {
		const response = await client.request(
			readItems("users", {
				fields: ["contributions"],
				filter: {
					address: {
						_eq: getAddress(address),
					},
				},
			}),
		);

		if (response.length === 0) {
			console.log(`[Directus] No user found with address: ${address}`);
			return [];
		}

		const contributions = await Promise.all(
			response[0].contributions.map(async (txId: string) => {
				try {
					return (await client.request(
						readItem("contributions", txId),
					)) as Contribution;
				} catch (error) {
					console.error(
						`[Directus] Failed to fetch contribution ${txId}: ${error}`,
					);
					return null;
				}
			}),
		);

		const validContributions = contributions.filter(Boolean) as Contribution[];
		console.log(
			`[Directus] Fetched contributions of ${address}: ${validContributions.length}`,
		);

		return validContributions;
	} catch (error) {
		console.error(
			`[Directus] Failed to fetch contributions by address ${address}: ${error}`,
		);
		throw new Error(
			`[Directus] Failed to fetch contributions by address ${address}: ${error}`,
		);
	}
};

/**
 * Retrieves a list of contributions associated with a given hypercert ID.
 * It fetches the contributions from the 'contributions' collection.
 * @param hypercertId - The unique identifier of the hypercert.
 * @returns - A promise that resolves to an array of contributions.
 * @throws {Error} - Throws an error if fetching contributions fails.
 */
export const getContributionsByHCId = async (
	hypercertId: string,
): Promise<Contribution[]> => {
	const client = getDirectusClient();

	// return the contributions from the cache if they exist
	if (contributionsByHCId[hypercertId]) {
		console.log(
			`[Directus] Contributions of hypercert ${hypercertId} already exist, returning from cache`,
		);
		return contributionsByHCId[hypercertId];
	}

	try {
		const response = await client.request(
			readItems("contributions", {
				filter: {
					hypercert_id: {
						_eq: hypercertId,
					},
				},
			}),
		);

		console.log(
			`[Directus] Fetched contributions of hypercert ${hypercertId}: ${response.length}`,
		);

		// cache the contributions
		contributionsByHCId[hypercertId] = response as Contribution[];

		return response as Contribution[];
	} catch (error) {
		console.error(
			`[Directus] Failed to fetch contributions by hypercert ID ${hypercertId}: ${error}`,
		);
		throw new Error(
			`[Directus] Failed to fetch contributions by hypercert ID ${hypercertId}: ${error}`,
		);
	}
};

/**
 * Retrieves the display name of a user by their wallet address.
 * It fetches the user from the 'users' collection and returns their display name.
 * @param address - The wallet address of the user.
 * @returns - A promise that resolves to the display name of the user.
 * @throws {Error} - Throws an error if fetching the user fails.
 */
export const getUserDisplayName = async (address: Address): Promise<string> => {
	const client = getDirectusClient();

	// return the display name from the cache if it exists
	if (users[address]) {
		return users[address];
	}

	try {
		const response = await client.request(
			readItem("users", getAddress(address), {
				fields: ["display_name"],
			}),
		);

		// cache the display name
		users[address] = response.display_name;

		return response.display_name;
	} catch (error) {
		console.error(
			`[Directus] Failed to fetch display name of user ${address}: ${error}`,
		);
		throw new Error(
			`[Directus] Failed to fetch display name of user ${address}: ${error}`,
		);
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
		directusClient = createDirectus(process.env.CMS_ENDPOINT)
			.with(staticToken(process.env.CMS_ACCESS_TOKEN as string))
			.with(rest());
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
		transport: http(
			process.env.JSON_RPC_ENDPOINT ? process.env.JSON_RPC_ENDPOINT : undefined,
		),
	});

	return viemClient;
};

const updateContribution = async (
	hypercertId: string,
	contribution: Contribution,
): Promise<void> => {
	const release = await contributionsMutex.acquire();

	try {
		if (!contributionsByHCId[hypercertId]) {
			contributionsByHCId[hypercertId] = [];
		}
		contributionsByHCId[hypercertId].push(contribution);
	} finally {
		release();
	}
};
