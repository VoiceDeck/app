import { http, createPublicClient, getContract } from "viem";
import { mainnet, sepolia } from "viem/chains";
import { multivaultAbi } from "../abis/ethMultiVault";
import { MULTIVAULT_CONTRACT_ADDRESS } from "./constants";

const infuraRpcUrl = process.env.INFURA_RPC_URL;
const infuraMainnetRpcUrl = process.env.INFURA_MAINNET_RPC_URL;

export const publicClient = createPublicClient({
	batch: {
		multicall: true,
	},
	chain: sepolia,
	transport: http(infuraRpcUrl),
});

export const mainnetClient = createPublicClient({
	chain: mainnet,
	transport: http(infuraMainnetRpcUrl),
});

export const getMultivaultContract = getContract({
	address: MULTIVAULT_CONTRACT_ADDRESS,
	abi: multivaultAbi,
	client: publicClient,
});

export const multiVaultContract = {
	address: MULTIVAULT_CONTRACT_ADDRESS,
	abi: multivaultAbi,
} as const;
