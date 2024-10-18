"use client";
import { asDeployedChain, deployments } from "@hypercerts-org/contracts";
import {
  WETHAbi,
  addressesByNetwork,
  utils,
} from "@hypercerts-org/marketplace-sdk";
import { sepolia } from "viem/chains";
import { useAccount, useReadContract } from "wagmi";

export const useGetCurrentERC20Allowance = () => {
  const { chainId, address } = useAccount();
  const hypercertsExchangeAddress =
    deployments[asDeployedChain(chainId ?? sepolia.id)].HypercertExchange;
  // TODO: FIX IT
  const wethAddress = "FILL_ME";
  const { data } = useReadContract({
    abi: WETHAbi,
    address: wethAddress as `0x${string}`,
    chainId,
    functionName: "allowance",
    // enabled: !!chainId && !!address && !!hypercertsExchangeAddress,
    args: [address, hypercertsExchangeAddress],
  });

  return (data || 0n) as bigint;
};
