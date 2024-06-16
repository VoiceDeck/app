const production = "https://api.hypercerts.org/v1/graphql";
const development = "https://staging-api.hypercerts.org/v1/graphql";

export const graphqlEndpoint = process.env.NODE_ENV === 'production' ? production : development;