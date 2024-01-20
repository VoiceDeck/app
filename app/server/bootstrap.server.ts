import { ClaimsByOwnerQuery, HypercertClient } from "@hypercerts-org/sdk";

import { Report } from "../model/report";
import { GraphService } from "./service/graph-service.server";
import { IpfsService } from "./service/ipfs-service.server";

export class ReportService {
	private static instance: ReportService;
	reports: Report[];

	hypercertClient: HypercertClient;

	constructor() {
		this.reports = new Array<Report>();

		this.hypercertClient = new HypercertClient({
			chain: { id: 11155111 }, // Sepolia
		});
	}

	static async getInstance(): Promise<ReportService> {
		if (!ReportService.instance) {
			ReportService.instance = new ReportService();
			await ReportService.instance.init();
		}

		return ReportService.instance;
	}

	getReports() {
		return this.reports;
	}

	private async init() {
		const claims = await this.getHyperCertClaims();
		for (const claim of claims) {
			const metadata = await this.getHyperCertMetadata(claim.uri as string);

			this.reports.push(new Report(metadata.name, metadata.description));
		}
	}

	private async getHyperCertClaims() {
		const graphService = await GraphService.getInstance();
		const { claims } = (await graphService.claimsByOwner(
			"0x42fbf4d890b4efa0fb0b56a9cc2c5eb0e07c1536",
		)) as ClaimsByOwnerQuery;

		return claims;
	}

	private async getHyperCertMetadata(claimUri: string) {
		const ipfsService = await IpfsService.getInstance();
		const metadata = await ipfsService.getMetadata(claimUri);

		return metadata;
	}
}
