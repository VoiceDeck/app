import { parseUnits } from "viem";
import { CONSTANTS } from "@hypercerts-org/sdk";
import { ENVIRONMENT } from "@/config/constants";

const HYPERCERT_API_URL =
  CONSTANTS.ENDPOINTS[ENVIRONMENT as keyof typeof CONSTANTS.ENDPOINTS];

export const HYPERCERTS_API_URL_REST = `${HYPERCERT_API_URL}/v1`;
export const HYPERCERTS_API_URL_GRAPH = `${HYPERCERT_API_URL}/v1/graphql`;

export const DEFAULT_NUM_FRACTIONS = parseUnits("1", 8);

export const DEFAULT_DISPLAY_CURRENCY = "usd";
