"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Address } from "viem";
import { z } from "zod";
import type { useHandleBuyFraction } from "./use-buy-fraction";

interface SupportFormInputs {
  fractionPayment: number;
  comment: string;
  hideName: boolean;
  hideAmount: boolean;
}

const useSupportForm = (
  dollarAmountNeeded: number,
  pricePerUnit: number,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  order: any,
  handleBuyFraction: ReturnType<
    typeof useHandleBuyFraction
  >["handleBuyFraction"],
  address: Address | undefined,
  hypercertId: string | undefined
) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fractionSaleFormSchema = z.object({
    fractionPayment: z.coerce.number().min(1).max(Number(dollarAmountNeeded)),
    comment: z.string(),
    hideName: z.boolean(),
    hideAmount: z.boolean(),
  });

  const form = useForm<SupportFormInputs>({
    resolver: zodResolver(fractionSaleFormSchema),
    defaultValues: {
      fractionPayment: 1,
      comment: "",
      hideName: false,
      hideAmount: false,
    },
  });

  const onSubmit = async (values: SupportFormInputs) => {
    setIsProcessing(true);
    form.reset();
    const unitsToBuy = values.fractionPayment / pricePerUnit;
    if (!address) {
      throw new Error("No address found");
    }

    const txnReceipt = await handleBuyFraction(order, unitsToBuy, address);
    if (txnReceipt) {
      await fetch("/api/contributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          txId: txnReceipt.transactionHash as `0x${string}`,
          hypercertId: hypercertId ?? "",
          amount: values.fractionPayment,
          comment: values.comment,
        }),
      });
    }
  };

  return { form, isProcessing, onSubmit };
};

export default useSupportForm;
