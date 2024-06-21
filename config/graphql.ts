export const HYPERCERTS_API_URL_REST = "https://staging-api.hypercerts.org/v1";
export const HYPERCERTS_API_URL =
  "https://staging-api.hypercerts.org/v1/graphql";
export const HYPERCERTS_DEFAULT_CONTRACT =
  "0xa16dfb32eb140a6f3f2ac68f41dad8c7e83c4941";


const production = "https://staging-api.hypercerts.org/v1/graphql";
const development = "https://staging-api.hypercerts.org/v1/graphql";

export const graphqlEndpoint = process.env.NODE_ENV === 'production' ? production : development;