import { useGetCurrentERC20Allowance } from "@/hooks/use-get-current-erc20-allowance";
import type { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import { useState } from "react";
import type { Address } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import type { UsePublicClientReturnType } from "wagmi";

export enum TransactionStatuses {
  PreparingOrder = "preparingOrder",
  Approval = "approval",
  SignForBuy = "signForBuy",
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
  const currentAllowance = useGetCurrentERC20Allowance();

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

    // if I enter 1 USD to buy in the UI, the amount will be 1000000000000000n
    // amount: 1000000000000000n (10^15)
    // pricePerUnit: 1
    console.log({ order, amount, address, hypercertId, comment });
    // print order.price
    console.log(order.price);
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
      console.log(`myAmount: ${myAmount}`);
      const tx = await call({ value: myAmount });

      console.log(`amountInDollars: ${amountInDollars}`);
      fetch("/api/contributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
