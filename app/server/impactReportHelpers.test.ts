import { it } from "node:test";
import { afterAll, expect, expectTypeOf, test, vi } from "vitest";
import { fetchReports } from "~/server/impactReportHelpers";
import { Report } from "~/types";

test("fetch reports", async () => {
	// address used to mint test hypercerts in Sepolia testnet
	const ownerAddress = "0x42fbf4d890b4efa0fb0b56a9cc2c5eb0e07c1536";
	const consoleMock = vi.spyOn(console, "log");

	afterAll(() => {
		consoleMock.mockReset();
	});

	it("should fetch reports", async () => {
		const result = await fetchReports(ownerAddress);

		expectTypeOf(result).toEqualTypeOf<Report[]>();
		expect(result.length).toBeGreaterThan(0);
		expect(consoleMock).toHaveBeenCalledWith("Fetching reports from remote");
	});

	it("should not fetch reports if already cached", async () => {
		const result = await fetchReports(ownerAddress);

		expectTypeOf(result).toEqualTypeOf<Report[]>();
		expect(result.length).toBeGreaterThan(0);
		expect(consoleMock).toHaveBeenCalledWith(
			"Reports already exist, no need to fetch from remote",
		);
	});
});
