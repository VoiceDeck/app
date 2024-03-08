import { fetchReportBySlug } from "@/lib/impact-reports";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req?.url;

  const slug = url?.split("/").pop();

  if (typeof slug !== "string") {
    return NextResponse.json(
      { error: "Slug must be a string" },
      { status: 500 }
    );
  }

  try {
    const reportData = await fetchReportBySlug(slug);
    return NextResponse.json(reportData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? String(error) },
      { status: 500 }
    );
  }
}
