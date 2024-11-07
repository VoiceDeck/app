import { processNewCryptoContribution, processNewFiatContribution } from "@/lib/directus";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { sender, txId, hypercertId, amount, comment } = await req.json();

		if (!hypercertId || !amount) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		if (sender && txId) {
			const result = await processNewCryptoContribution(
				sender,
				txId,
				hypercertId,
				amount,
				comment,
			);
			return NextResponse.json(result);
		} else {
			// when sender and txId field is omitted
			// then, assuming it's a fiat contribution
			const result = await processNewFiatContribution(
				hypercertId,
				amount,
				comment,
			);
			return NextResponse.json(result);
		}

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
