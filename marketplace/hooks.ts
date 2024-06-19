import {
  useAccount,
  useChainId,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { useEthersProvider } from "@/hooks/use-ethers-provider";
import { useEthersSigner } from "@/hooks/use-ethers-signer";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addressesByNetwork,
  ApiClient,
  HypercertExchangeClient,
  Maker,
  QuoteType,
  utils,
  WETHAbi,
} from "@hypercerts-org/marketplace-sdk";
import { useHypercertClient } from "@/hooks/use-hypercerts-client";
import { useStepProcessDialogContext } from "@/components/global/step-process-dialog";
import { parseClaimOrFractionId } from "@hypercerts-org/sdk";
import { isAddress, parseEther } from "viem";
import { readContract, waitForTransactionReceipt } from "viem/actions";
import {
  CreateFractionalOfferFormValues,
  useFetchHypercertFractionsByHypercertId,
} from "@/components/marketplace/create-fractional-sale-form";
import { MarketplaceOrder } from "@/marketplace/types";
import { decodeContractError } from "@/lib/decodeContractError";

export const useCreateOrderInSupabase = () => {
  const chainId = useChainId();
  const provider = useEthersProvider();
  const signer = useEthersSigner();

  return useMutation({
    mutationKey: ["createOrderInSupabase"],
    mutationFn: async ({
      order,
      signature,
    }: {
      order: Maker;
      signer: string;
      signature: string;
      quoteType: QuoteType;
      // currency: string;
    }) => {
      if (!chainId) {
        throw new Error("No chainId");
      }

      if (!provider) {
        throw new Error("No provider");
      }

      if (!signer) {
        throw new Error("No signer");
      }

      const hypercertExchangeClient = new HypercertExchangeClient(
        chainId,
        // TODO: Fix typing issue with provider
        // @ts-ignore
        provider as unknown as Provider,
        // @ts-ignore
        signer,
      );

      return hypercertExchangeClient.registerOrder({
        order,
        signature,
      });
    },
    throwOnError: true,
  });
};
export const useCreateFractionalMakerAsk = ({
  hypercertId,
}: {
  hypercertId: string;
}) => {
  const { mutateAsync: createOrder } = useCreateOrderInSupabase();

  const chainId = useChainId();
  const client = useHypercertClient();
  const { address } = useAccount();
  const { data: walletClientData } = useWalletClient();
  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const { data: currentFractions } =
    useFetchHypercertFractionsByHypercertId(hypercertId);

  const { setSteps, setStep, setOpen } = useStepProcessDialogContext();

  return useMutation({
    mutationKey: ["createFractionalMakerAsk"],
    mutationFn: async (values: CreateFractionalOfferFormValues) => {
      if (!client) {
        throw new Error("Client not initialized");
      }

      if (!chainId) {
        throw new Error("Chain ID not initialized");
      }

      if (!address) {
        throw new Error("Address not initialized");
      }

      if (!currentFractions) {
        throw new Error("Fractions not found");
      }

      if (!provider) {
        throw new Error("Provider not initialized");
      }

      if (!signer) {
        throw new Error("Signer not initialized");
      }

      const { contractAddress, id: fractionTokenId } = parseClaimOrFractionId(
        values.fractionId,
      );

      if (!contractAddress || !isAddress(contractAddress)) {
        throw new Error("Invalid contract address");
      }

      if (!walletClientData) {
        throw new Error("Wallet client not initialized");
      }
      setSteps([
        {
          id: "Create",
          description: "Creating order in contract",
        },
        {
          id: "Approve transfer manager",
          description: "Approving transfer manager",
        },
        {
          id: "Approve collection",
          description: "Approving collection",
        },
        {
          id: "Sign order",
          description: "Signing order",
        },
        {
          id: "Create order",
          description: "Creating order",
        },
      ]);
      setOpen(true);

      let signature: string | undefined;

      setStep("Create");
      const hypercertExchangeClient = new HypercertExchangeClient(
        chainId,
        // TODO: Fix typing issue with provider
        // @ts-ignore
        provider as unknown as Provider,
        // @ts-ignore
        signer,
      );

      const { maker, isCollectionApproved, isTransferManagerApproved } =
        await hypercertExchangeClient.createFractionalSaleMakerAsk({
          startTime: Math.floor(Date.now() / 1000), // Use it to create an order that will be valid in the future (Optional, Default to now)
          endTime: Math.floor(Date.now() / 1000) + 86400, // If you use a timestamp in ms, the function will revert
          price: parseEther(values.price), // Be careful to use a price in wei, this example is for 1 ETH
          itemIds: [fractionTokenId.toString()], // Token id of the NFT(s) you want to sell, add several ids to create a bundle
          minUnitAmount: BigInt(values.minUnitsToKeep), // Minimum amount of units to keep after the sale
          maxUnitAmount: BigInt(values.maxUnitAmount), // Maximum amount of units to sell
          minUnitsToKeep: BigInt(values.minUnitsToKeep), // Minimum amount of units to keep after the sale
          sellLeftoverFraction: values.sellLeftoverFraction, // If you want to sell the leftover fraction
        });

      // Grant the TransferManager the right the transfer assets on behalf od the LooksRareProtocol
      setStep("Approve transfer manager");
      if (!isTransferManagerApproved) {
        const tx = await hypercertExchangeClient
          .grantTransferManagerApproval()
          .call();
        await waitForTransactionReceipt(walletClientData, {
          hash: tx.hash as `0x${string}`,
        });
      }

      setStep("Approve collection");
      // Approve the collection items to be transferred by the TransferManager
      if (!isCollectionApproved) {
        const tx = await hypercertExchangeClient.approveAllCollectionItems(
          maker.collection,
        );
        await waitForTransactionReceipt(walletClientData, {
          hash: tx.hash as `0x${string}`,
        });
      }

      // Sign your maker order
      setStep("Sign order");
      signature = await hypercertExchangeClient.signMakerOrder(maker);

      if (!signature) {
        throw new Error("Error signing order");
      }

      setStep("Create order");
      try {
        await createOrder({
          order: maker,
          signature: signature,
          signer: address,
          quoteType: QuoteType.Ask,
        });
      } catch (e) {
        console.error(e);
        throw new Error("Error registering order");
      }
    },
    throwOnError: true,
    onSuccess: () => {
      setOpen(false);
    },
  });
};

export const useFetchMarketplaceOrdersForHypercert = (hypercertId: string) => {
  const { client } = useHypercertClient();
  const chainId = useChainId();
  const provider = usePublicClient();

  return useQuery({
    queryKey: ["hypercert", "id", hypercertId, "chain", chainId, "orders"],
    queryFn: async () => {
      if (!provider) {
        return null;
      }
      const apiClient = new ApiClient();
      const { data: orders } = await apiClient.fetchOrdersByHypercertId({
        hypercertId,
      });
      return orders;
    },
    enabled: !!client && !!chainId,
  });
};
export const useGetCurrentERC20Allowance = () => {
  const chainId = useChainId();
  const { address } = useAccount();
  const hypercertsExchangeAddress =
    addressesByNetwork[utils.asDeployedChain(chainId)].EXCHANGE_V2;

  const { data: walletClient } = useWalletClient();

  return async (currency: `0x${string}`) => {
    if (!walletClient) {
      return BigInt(0);
    }

    const data = await readContract(walletClient, {
      abi: WETHAbi,
      address: currency as `0x${string}`,
      functionName: "allowance",
      args: [address, hypercertsExchangeAddress],
    });

    return data as bigint;
  };
};
export const useBuyFractionalMakerAsk = () => {
  const chainId = useChainId();
  const { setStep, setSteps, setOpen } = useStepProcessDialogContext();
  const { data: walletClientData } = useWalletClient();
  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const { address } = useAccount();
  const getCurrentERC20Allowance = useGetCurrentERC20Allowance();

  return useMutation({
    mutationKey: ["buyFractionalMakerAsk"],
    mutationFn: async ({
      order,
      unitAmount,
      pricePerUnit,
    }: {
      order: MarketplaceOrder;
      unitAmount: string;
      pricePerUnit: string;
    }) => {
      if (!chainId) {
        setOpen(false);
        throw new Error("No chain id");
      }

      if (!walletClientData) {
        setOpen(false);
        throw new Error("No wallet client data");
      }

      setSteps([
        {
          id: "Setting up order execution",
          description: "Setting up order execution",
        },
        {
          id: "ERC20",
          description: "Setting approval",
        },
        {
          id: "Transfer manager",
          description: "Approving transfer manager",
        },
        {
          id: "Awaiting buy signature",
          description: "Awaiting buy signature",
        },
        {
          id: "Awaiting confirmation",
          description: "Awaiting confirmation",
        },
      ]);
      setOpen(true);

      const hypercertExchangeClient = new HypercertExchangeClient(
        chainId,
        // @ts-ignore
        provider,
        signer,
      );
      setStep("Setting up order execution");
      const takerOrder = hypercertExchangeClient.createFractionalSaleTakerBid(
        order,
        address,
        unitAmount,
        parseEther(pricePerUnit),
      );

      try {
        setStep("ERC20");
        const currentAllowance = await getCurrentERC20Allowance(
          order.currency as `0x${string}`,
        );
        if (currentAllowance < BigInt(order.price) * BigInt(unitAmount)) {
          const approveTx = await hypercertExchangeClient.approveErc20(
            order.currency,
            BigInt(order.price) * BigInt(unitAmount),
          );
          await waitForTransactionReceipt(walletClientData, {
            hash: approveTx.hash as `0x${string}`,
          });
        }

        setStep("Transfer manager");
        const isTransferManagerApproved =
          await hypercertExchangeClient.isTransferManagerApproved();
        if (!isTransferManagerApproved) {
          const transferManagerApprove = await hypercertExchangeClient
            .grantTransferManagerApproval()
            .call();
          await waitForTransactionReceipt(walletClientData, {
            hash: transferManagerApprove.hash as `0x${string}`,
          });
        }
      } catch (e) {
        console.error(e);
        setOpen(false);
        throw new Error("Approval error");
      }

      try {
        setStep("Setting up order execution");
        const { call } = hypercertExchangeClient.executeOrder(
          order,
          takerOrder,
          order.signature,
        );
        setStep("Awaiting buy signature");
        const tx = await call();
        setStep("Awaiting confirmation");
        await waitForTransactionReceipt(walletClientData, {
          hash: tx.hash as `0x${string}`,
        });
      } catch (e) {
        console.error(e);

        const defaultMessage = `Error during step \"${"TO BE IMPLEMENTED CURRENT STEP"}\"`;
        throw new Error(decodeContractError(e, defaultMessage));
      } finally {
        setOpen(false);
      }
    },
  });
};
