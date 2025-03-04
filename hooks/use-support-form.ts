"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Address } from "viem";
import { z } from "zod";

import type { useHandleBuyFraction } from "./use-buy-fraction";

export interface SupportFormInputs {
  fractionPayment: number;
  comment: string;
  hideName: boolean;
  hideAmount: boolean;
  paymentType: "crypto" | "fiat-with-login" | "fiat-without-login";
  name?: string;
  email?: string;
  images?: string[];
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
  hypercertId: string | undefined,
) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fractionSaleFormSchema = z.object({
    fractionPayment: z.coerce.number().min(1).max(Number(dollarAmountNeeded)),
    comment: z.string(),
    hideName: z.boolean(),
    hideAmount: z.boolean(),
    paymentType: z.enum(["crypto", "fiat-with-login", "fiat-without-login"]).default("crypto"), 
    name: z.string().optional(),
    email: z.string().optional(),
    images: z.array(z.string()).optional(),
  });

  const form = useForm<SupportFormInputs>({
    resolver: zodResolver(fractionSaleFormSchema),
    defaultValues: {
      fractionPayment: 1,
      comment: "",
      hideName: false,
      hideAmount: false,
      paymentType:"crypto",
      name: "",
      email: "",
      images: [],  
    },
  });

  const onSubmit = async (values: SupportFormInputs) => {
    setIsProcessing(true);
    form.reset();
    console.log("values", values);
    console.log("pricePerUnit", pricePerUnit);
    const unitsToBuy = values.fractionPayment / pricePerUnit;
    if (!address) {
      throw new Error("No address found");
    }

    console.log("amount to buy: ", BigInt(Math.trunc(unitsToBuy)));
    await handleBuyFraction(
      order,
      BigInt(Math.trunc(unitsToBuy)),
      address,
      hypercertId,
      values.comment,
      values.fractionPayment,
      values.paymentType,
      values.email,
      values.name,
      values.images
    );
  };

  return { form, isProcessing, onSubmit };
};

export default useSupportForm;
