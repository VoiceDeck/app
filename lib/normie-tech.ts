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
                header: {
                    "x-api-key": string;
                };
                path: {
                    /** @description The project id */
                    projectId: string;
                };
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
    "/v1/{projectId}/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the list of transactions of related to the  project id */
        get: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path: {
                    /** @description The project id */
                    projectId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Returns the list of transactions of related to the  project id */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionWithPaymentUser"][];
                    };
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
    "/v1/{projectId}/transactions/{transactionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the transaction to the  project id and transaction id */
        get: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path: {
                    /** @description The project id */
                    projectId: string;
                    /** @description The transaction id */
                    transactionId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Returns transaction of project id and transaction id */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionWithPaymentUser"];
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
    "/v1/{projectId}/{paymentId}/transactions/{transactionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the transaction to the  project id , transaction id and payment Id */
        get: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path: {
                    /** @description The project id */
                    projectId: string;
                    /** @description The transaction id */
                    transactionId: string;
                    /** @description The payment id e.g 0 for stripe */
                    paymentId: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Returns transaction of project id , transaction id and payment Id */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionWithPaymentUser"];
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
    "/v1/{projectId}/{paymentId}/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns all the transaction related to project id and payment id */
        get: {
            parameters: {
                query?: never;
                header: {
                    "x-api-key": string;
                };
                path: {
                    /** @description The project id */
                    projectId: string;
                    /** @description The payment id e.g 0 for stripe */
                    paymentId: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Returns all the transaction related to project id and payment id */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionWithPaymentUser"][];
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
                        extraMetadata?: unknown;
                        customId?: string;
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
    schemas: {
        TransactionWithPaymentUser: {
            id: string;
            projectId: string | null;
            paymentId: string | null;
            externalPaymentProviderId: string | null;
            chainId: number | null;
            blockChainName: string | null;
            blockchainTransactionId: string | null;
            paymentUserId: string | null;
            amountInFiat: number | null;
            currencyInFiat: string | null;
            token: string;
            amountInToken: number;
            decimals: number;
            /** @enum {string|null} */
            tokenType: "TOKEN" | "NFT" | null;
            metadataJson: string | number | boolean | unknown | (string | number | boolean | unknown | (string | number | boolean | unknown | unknown)[] | {
                [key: string]: string | number | boolean | unknown | unknown;
            } | unknown)[] | {
                [key: string]: string | number | boolean | unknown | (string | number | boolean | unknown | (string | number | boolean | unknown | unknown)[] | {
                    [key: string]: string | number | boolean | unknown | unknown;
                } | unknown)[] | unknown;
            } | unknown;
            extraMetadataJson: string | number | boolean | unknown | (string | number | boolean | unknown | (string | number | boolean | unknown | unknown)[] | {
                [key: string]: string | number | boolean | unknown | unknown;
            } | unknown)[] | {
                [key: string]: string | number | boolean | unknown | (string | number | boolean | unknown | (string | number | boolean | unknown | unknown)[] | {
                    [key: string]: string | number | boolean | unknown | unknown;
                } | unknown)[] | unknown;
            } | unknown;
            /** @enum {string|null} */
            status: "pending" | "confirmed-onchain" | "failed" | "cancelled" | "refunded" | "confirmed" | null;
            paymentUser: {
                id: string;
                email: string | null;
                name: string | null;
                paypalId: string | null;
                externalId: string | null;
                projectId: string | null;
                phoneNumber: string | null;
                createdAt: string | null;
                updatedAt: string | null;
            } | null;
            metadata?: unknown;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;


export const normieTechClient =  createClient<paths>({ 
  baseUrl: "https://2xapgk7057.execute-api.us-east-1.amazonaws.com/dipanshu",
  headers:{
    "Access-Control-Allow-Origin":"*",
    "Content-Type":"application/json"
  }
});
