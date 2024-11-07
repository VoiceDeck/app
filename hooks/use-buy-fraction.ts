import { DEFAULT_BLOCKCHAIN_NAME, DEFAULT_CHAIN_ID } from "@/config/constants";
import { normieTechClient } from "@/lib/normie-tech";
import type { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import type { EthersError } from "ethers";
import { useState } from "react";
import type { Address } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import type { UsePublicClientReturnType } from "wagmi";
import { nanoid } from "nanoid";


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
export type PaymentType = "fiat-with-login" | "fiat-without-login" | "crypto" ;
const useHandleBuyFraction = (
  publicClient: UsePublicClientReturnType,
  hypercertExhangeClient: HypercertExchangeClient,
  defaultTransactionStatus = TransactionStatuses.PreparingOrder
) => {
  const [transactionStatus, setTransactionStatus] =
    useState<keyof typeof TransactionStatuses>("Pending");
  const [transactionHash, setTransactionHash] = useState<Address | null>(null);
  const handleFiatBuyFraction = async ( 
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    order: any,
    amount: bigint,
    address: Address,
    hypercertId: string | undefined,
    comment: string | undefined,
    amountInDollars: number,
    email?: string,
    name?: string,
    images?: string[]
  ) =>{
    try{
    console.log("ordcer",order)
    const customId = nanoid(20)
    const amountInCents = amountInDollars * 100;
    setTransactionStatus("PreparingOrder");
    const res = (await normieTechClient.POST("/v1/voice-deck/0/checkout",{
      params: {
        header: {
          "x-api-key":process.env.NEXT_PUBLIC_NORMIE_TECH_API_KEY ?? "",
          
        }
      },
      body:{
        customId:customId,
        extraMetadata:{
          hypercertId,
          comment,
          sender:address
        },
        amount: amountInCents,
        chainId: DEFAULT_CHAIN_ID,
        customerEmail: email,
        name: name ? name : "Donation",
        blockChainName:DEFAULT_BLOCKCHAIN_NAME,
        images:images,
        success_url: `${window.location.href}?transactionId=${customId}`,
        metadata:{
          order,
          amount:Number.parseInt(amount.toString()),
          // give in dominations of usdc decimals
          amountApproved:amountInDollars * 1_000_000,

          recipient:address,
          chainId:DEFAULT_CHAIN_ID,
        }
      }
    })).data
    console.log("res", res)
    if(res){
      setTransactionStatus("Approval")

      window.open(res.url,"_self")
    }
  }catch(e){
    setTransactionStatus("Failed"); // generic fail error
    return

  }
    
  }
  const handleCryptoBuyFraction = async (
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    order: any,
    amount: bigint,
    address: Address,
    hypercertId: string | undefined,
    comment: string | undefined,
    amountInDollars: number,
  ) => {


    if (!publicClient) {
      throw new Error("No public client found");
    }
    if (!order) {
      throw new Error("No order found");
    }

    console.log("amounttt", amount);
    console.log("order", JSON.stringify(order));
    console.log("order price", order.price);

    const takerOrder = hypercertExhangeClient.createFractionalSaleTakerBid(
      order,
      address,
      amount,
      order.price
    );

    try {
      console.log("doolor: ", amountInDollars)
      console.log("doolor: ", BigInt(amountInDollars));
    const approveTx = await hypercertExhangeClient.approveErc20(order.currency, BigInt(amountInDollars * 1_000_000));

    await waitForTransactionReceipt(publicClient, {
      hash: approveTx.hash as `0x${string}`,
    });
  } catch (e) {
    console.error("faiiled to approve tx: " + e);
  }

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
  const handleBuyFraction = async (
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    order: any,
    amount: bigint,
    address: Address,
    hypercertId: string | undefined,
    comment: string | undefined,
    amountInDollars: number,
    paymentType = "crypto" as PaymentType,
    email?: string,
    name?: string,
    images?: string[]
  ) => {
    switch (paymentType) {
      case "crypto":
        return handleCryptoBuyFraction(
          order,
          amount,
          address,
          hypercertId,
          comment,
          amountInDollars
        );

      case "fiat-with-login":
        return handleFiatBuyFraction(
          order,
          amount,
          address,
          hypercertId,
          comment,
          amountInDollars,
          email,
          name,
          images
        );
      // case "fiat-without-login": {
      //   if (!email) {
      //     throw new Error("Email is required for fiat-without-login");
      //   }
      //   const wallet : {wallet:User} = await fetch("/api/wallet-generate", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       address: email,
      //     }),
      //   }).then((res) => res.json());
      //   if(!wallet.wallet.wallet?.address){
      //     setTransactionStatus("Failed");

      //     return
      //   }
      //   return handleFiatBuyFraction(
      //     order,
      //     amount,
      //     wallet.wallet.wallet.address as Address,
      //     hypercertId,
      //     comment,
      //     amountInDollars,
      //     email,
      //     name,
      //     images
      //   );
      // }
      

    }

    
  };

  return { handleBuyFraction, setTransactionStatus,transactionStatus, transactionHash };
};

export { useHandleBuyFraction };
