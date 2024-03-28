import { type NextRequest, NextResponse } from "next/server";

import { getViemClient, removeContribution } from "@/lib/directus";

export async function POST(req: NextRequest) {
	try {
		const { txId } = await req.json();
		if (!txId) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		const viemClient = getViemClient();

		// wait for the transaction to be included in a block
		console.log(
			`[Viem] waiting for tx ${txId} to be included in a block . . .`,
		);
		const txReceipt = await viemClient.waitForTransactionReceipt({
			hash: txId,
		});
		console.log(`[Viem] tx ${txId} included in block ${txReceipt.blockNumber}`);

		if (txReceipt.status === "reverted") {
			console.log(`[Viem] tx ${txId} reverted, remove from CMS . . .`);

			await removeContribution(txId);
			return NextResponse.json({ txStatus: "deleted" }, { status: 200 });
		}
		return NextResponse.json({ txStatus: "ok" }, { status: 200 });
	} catch (error) {
		let errorMessage = "An unknown error occurred";
		if (typeof error === "object" && error !== null) {
			errorMessage = (error as { message?: string }).message ?? errorMessage;
		} else if (typeof error === "string") {
			errorMessage = error;
		}
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
