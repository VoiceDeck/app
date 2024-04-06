import type { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import type { EthersError } from "ethers";
import { useState } from "react";
import type { Address } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import type { UsePublicClientReturnType } from "wagmi";

export enum TransactionStatuses {
  PreparingOrder = 0,
  Approval = 1,
  SignForBuy = 2,
  Pending = 3,
  Confirmed = 4,
  Failed = 5,
  InsufficientFunds = 6,
  ActionRejected = 7,
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
    amount: bigint,
    address: Address,
    hypercertId: string | undefined,
    comment: string | undefined,
    amountInDollars: number
  ) => {
    if (!publicClient) {
      throw new Error("No public client found");
    }
    if (!order) {
      throw new Error("No order found");
    }

    const takerOrder = hypercertExhangeClient.createFractionalSaleTakerBid(
      order,
      address,
      amount,
      order.price
    );

    try {
      setTransactionStatus("PreparingOrder");
      const { call } = hypercertExhangeClient.executeOrder(
        order,
        takerOrder,
        order.signature
      );

      setTransactionStatus("SignForBuy");
      const myAmount = BigInt(order.price) * amount;
      const tx = await call({ value: myAmount });

      fetch("/api/contributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: address,
          txId: tx.hash as `0x${string}`,
          hypercertId: hypercertId,
          amount: amountInDollars,
          comment: comment,
        }),
      });

      setTransactionHash(tx.hash as Address);
      setTransactionStatus("Pending");
      const txnReceipt = await waitForTransactionReceipt(publicClient, {
        hash: tx.hash as `0x${string}`,
      });
      setTransactionStatus("Confirmed");
      return txnReceipt;
    } catch (e) {
      const error = e as EthersError;
      if (error.code === "INSUFFICIENT_FUNDS") {
        setTransactionStatus("InsufficientFunds");
        return;
      }
      if (error.code === "ACTION_REJECTED") {
        setTransactionStatus("ActionRejected");
        return;
      }
      setTransactionStatus("Failed"); // generic fail error
      return;
    }
  };

  return { handleBuyFraction, transactionStatus, transactionHash };
};

export { useHandleBuyFraction };
