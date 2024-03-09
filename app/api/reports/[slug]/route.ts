import { fetchReportBySlug } from "@/lib/impact-reports";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const url = req?.url;

	const slug = url?.split("/").pop();

	if (typeof slug !== "string") {
		return NextResponse.json(
			{ error: "Slug must be a string" },
			{ status: 500 },
		);
	}

	try {
		const reportData = await fetchReportBySlug(slug);
		return NextResponse.json(reportData, { status: 200 });
	} catch (error: unknown) {
		const message =
			typeof error === "object" && error !== null
				? (error as { message?: string }).message
				: String(error);
		return NextResponse.json(
			{ error: message ?? "An unknown error occurred" },
			{ status: 500 },
		);
	}
}
