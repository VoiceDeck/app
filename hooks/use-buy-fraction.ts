import type { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import { useState } from "react";
import type { Address } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import type { UsePublicClientReturnType } from "wagmi";

export enum TransactionStatuses {
  Pending = "pending",
  Confirmed = "confirmed",
  Failed = "failed",
}

const useHandleBuyFraction = (
  publicClient: UsePublicClientReturnType,
  hypercertExhangeClient: HypercertExchangeClient
) => {
  const [transactionStatus, setTransactionStatus] =
    useState<keyof typeof TransactionStatuses>("Pending");
  const [transactionHash, setTransactionHash] = useState<Address | null>(null);

  const handleBuyFraction = async (
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    order: any,
    amount: number,
    address?: Address
  ) => {
    if (!publicClient) {
      console.error("No public client found");
      return;
    }
    if (!order) {
      console.error("No order found");
      return;
    }

    const takerOrder = hypercertExhangeClient.createFractionalSaleTakerBid(
      order,
      address,
      amount,
      order.price
    );

    try {
      // Set approval for exchange to spend funds
      // setStep("Setting approval");
      const totalPrice = BigInt(order.price) * BigInt(amount);
      const approveTx = await hypercertExhangeClient.approveErc20(
        order.currency, // Be sure to set the allowance for the correct currency
        totalPrice
      );
      const approveResult = await waitForTransactionReceipt(publicClient, {
        hash: approveTx.hash as `0x${string}`,
      });
      // console.log({ approveResult });
    } catch (e) {
      console.error(e);
      setTransactionStatus("Failed");
    }

    try {
      const { call } = hypercertExhangeClient.executeOrder(
        order,
        takerOrder,
        order.signature
      );
      console.info("Awaiting buy signature");
      const tx = await call();
      setTransactionHash(tx.hash as Address);
      console.info("Awaiting confirmation", tx);
      const txnReceipt = await waitForTransactionReceipt(publicClient, {
        hash: tx.hash as `0x${string}`,
      });
      console.log({ txnReceipt });
      setTransactionStatus("Confirmed");
      return txnReceipt;
    } catch (e) {
      console.error(e);
      setTransactionStatus("Failed");
    }
  };

  return { handleBuyFraction, transactionStatus, transactionHash };
};

export { useHandleBuyFraction };
