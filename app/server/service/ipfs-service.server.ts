import type { HypercertClient } from "@hypercerts-org/sdk";

import { ReportService } from "../bootstrap.server";

export class IpfsService {
	private static instance: IpfsService;
	private hypercertClient: HypercertClient;

	constructor(hypercertClient: HypercertClient) {
		this.hypercertClient = hypercertClient;
	}

	static async getInstance(): Promise<IpfsService> {
		if (!IpfsService.instance) {
			IpfsService.instance = new IpfsService(
				(await ReportService.getInstance()).hypercertClient,
			);
		}
		return IpfsService.instance;
	}

	// get metadata of hypercert claim
	// see Hypercert metadata format v1.4.1: https://github.com/hypercerts-org/hypercerts/blob/89009f1fcd072aaedd06ede8ba264623277244e9/sdk/src/types/metadata.d.ts#L11-L46
	async getMetadata(claimUri: string) {
		return await this.hypercertClient.storage.getMetadata(claimUri);
	}
}
