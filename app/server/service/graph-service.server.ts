import type { HypercertClient } from "@hypercerts-org/sdk";

import { ReportService } from "../bootstrap.server";

// graphql schema of hypercert v1.4.1: https://github.com/hypercerts-org/hypercerts/blob/89009f1fcd072aaedd06ede8ba264623277244e9/graph/schema.graphql
export class GraphService {
	private static instance: GraphService;
	private hypercertClient: HypercertClient;

	constructor(hypercertClient: HypercertClient) {
		this.hypercertClient = hypercertClient;
	}

	static async getInstance(): Promise<GraphService> {
		if (!GraphService.instance) {
			GraphService.instance = new GraphService(
				(await ReportService.getInstance()).hypercertClient,
			);
		}
		return GraphService.instance;
	}

	// see graphql query: https://github.com/hypercerts-org/hypercerts/blob/main/sdk/src/indexer/queries/claims.graphql#L1-L11
	async claimsByOwner(owner: string) {
		return await this.hypercertClient.indexer.claimsByOwner(owner);
	}
}
