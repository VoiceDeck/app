import { processNewContribution } from "@/lib/directus";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { txId, hypercertId, amount, comment } = await req.json();
		if (!txId || !hypercertId || !amount) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}
		const result = await processNewContribution(
			txId,
			hypercertId,
			amount,
			comment,
		);
		return NextResponse.json(result);
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
