import { fetchReportBySlug } from "@/lib/impact-reports";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	request: Request,
	{ params }: { params: { slug: string } },
) {
	const slug = params.slug;
	/* 
  	We don't need this api route unless we need to call this function from the client.
  	Currently in reports/[slug]/page.tsx, we can call using SSR.
  */
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
