import "server-only";

import { ApiClient } from "@hypercerts-org/marketplace-sdk";

export async function getOpenOrders(hypercertId: string) {
  const apiClient = new ApiClient("test");
  if (!apiClient) {
    throw new Error("ApiClient is not initialized");
  }
  const { data: orders } = await apiClient.fetchOrdersByHypercertId({
    hypercertId,
  });

  return orders;
}
