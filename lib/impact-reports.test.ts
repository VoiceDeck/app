
import type { Report } from "@/types";

import {
	afterAll,
	beforeEach,
	describe,
	expect,
	expectTypeOf,
	it,
	vi,
} from "vitest";
import { fetchReportBySlug, fetchReports } from "./impact-reports";

describe.concurrent("fetch reports", async () => {
	const consoleMock = vi.spyOn(console, "log");

	beforeEach(() => {
		// address used to mint test hypercerts in Sepolia testnet
		import.meta.env.HC_OWNER_ADDRESS =
			"0x475DB4E7c8976fd243D3d6fA444fda524cefbaf9";
		import.meta.env.CMS_ENDPOINT = "https://directus.vd-dev.org/";
	});

	afterAll(() => {
		consoleMock.mockReset();
	});

	it.sequential("should fetch reports", async () => {
		const result = await fetchReports();

		expectTypeOf(result).toEqualTypeOf<Report[]>();
		expect(result.length).toBeGreaterThan(0);
		expect(consoleMock).toHaveBeenCalledWith(
			`[server] Fetching reports from remote using owner address: ${
				import.meta.env.HC_OWNER_ADDRESS
			}`,
		);
	});

	it.sequential("should not fetch reports if already cached", async () => {
		const result = await fetchReports();

		expectTypeOf(result).toEqualTypeOf<Report[]>();
		expect(result.length).toBeGreaterThan(0);
		expect(consoleMock).toHaveBeenCalledWith(
			"[server] Reports already exist, no need to fetch from remote",
		);
	});

	it.sequential(
		"should throw an error if owner address is not set",
		async () => {
			import.meta.env.HC_OWNER_ADDRESS = "";
			await expect(fetchReports()).rejects.toThrow(
				"Owner address environment variable is not set",
			);
		},
	);

	it.sequential("should get report by slug", async () => {
		// Assuming the slug exists and minted by the owner address
		const slug = "cycle-with-assisting-wheels-provided-gopal-kumar";

		const result = await fetchReportBySlug(slug);

		expectTypeOf(result).toEqualTypeOf<Report>();
		expect(result.slug).toEqual(slug);
	});
});
