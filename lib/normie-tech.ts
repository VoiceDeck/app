import createClient from "openapi-fetch";
export interface paths {
  "/v1/{projectId}/info": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      /** @description Returns the current info of the project */
      get: {
          parameters: {
              query?: never;
              header?: never;
              path?: never;
              cookie?: never;
          };
          requestBody?: never;
          responses: {
              /** @description Returns the current info of the project */
              200: {
                  headers: {
                      [name: string]: unknown;
                  };
                  content: {
                      "application/json": {
                          id: string;
                          name: string;
                          /** Format: uri */
                          url: string;
                          /** @default true */
                          fiatActive: boolean;
                      };
                  };
              };
              /** @description Internal Server Error */
              500: {
                  headers: {
                      [name: string]: unknown;
                  };
                  content?: never;
              };
          };
      };
      put?: never;
      post?: never;
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
  "/v1/voice-deck/0/checkout": {
      parameters: {
          query?: never;
          header?: never;
          path?: never;
          cookie?: never;
      };
      get?: never;
      put?: never;
      /** @description Create a checkout session for stripe in the voice deck project */
      post: {
          parameters: {
              query?: never;
              header: {
                  "x-api-key": string;
              };
              path?: never;
              cookie?: never;
          };
          /** @description The request body of voice deck stripe checkout */
          requestBody: {
              content: {
                  "application/json": {
                      description?: string;
                      name: string;
                      images?: string[];
                      amount: number;
                      /** Format: uri */
                      success_url: string;
                      chainId: number;
                      /** @default evm */
                      blockChainName?: string;
                      /** Format: email */
                      customerEmail?: string;
                      metadata: {
                          order: {
                              quoteType: number;
                              globalNonce: string;
                              orderNonce: string;
                              strategyId: number;
                              collectionType: number;
                              collection: string;
                              currency: string;
                              signer: string;
                              startTime: number;
                              endTime: number;
                              price: string;
                              signature: string;
                              additionalParameters: string;
                              subsetNonce: number;
                              itemIds: string[];
                              amounts: number[];
                          };
                          recipient: string;
                          amount: number;
                          amountApproved: number;
                          /** @default 10 */
                          chainId?: 10 | 8453 | 42161;
                      };
                  };
              };
          };
          responses: {
              /** @description Returns the checkout session */
              200: {
                  headers: {
                      [name: string]: unknown;
                  };
                  content: {
                      "application/json": {
                          projectId: string;
                          paymentId: string;
                          url: string;
                          transactionId: string;
                      };
                  };
              };
              /** @description Internal Server Error */
              500: {
                  headers: {
                      [name: string]: unknown;
                  };
                  content?: never;
              };
          };
      };
      delete?: never;
      options?: never;
      head?: never;
      patch?: never;
      trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: never;
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;

export const normieTechClient =  createClient<paths>({ 
  baseUrl: "https://api.normie.tech",
  headers:{
    "Access-Control-Allow-Origin":"*",
    "Content-Type":"application/json"
  }
});
