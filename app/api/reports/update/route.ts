import { fetchNewReports } from "@/lib/impact-reports";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		await fetchNewReports();
		return NextResponse.json({ status: 200 });
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
