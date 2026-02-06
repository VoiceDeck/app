import { processNewContribution } from "@/lib/directus";
import { sendContributionEmail } from "@/lib/email";
import { fetchReportBySlug } from "@/lib/impact-reports";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
	try {
		const { sender, txId, hypercertId, amount, comment, email, slug } =
			await req.json();
		if (!sender || !txId || !hypercertId || !amount) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}
		console.log({ sender, txId, hypercertId, amount, comment, email, slug });
		const result = await processNewContribution(
			sender,
			txId,
			hypercertId,
			amount,
			comment,
		);
		const reportData = await fetchReportBySlug(slug as string);
		if (email) {
			await sendContributionEmail({
				amount: Number(amount),
				campaignImageUrl: reportData.image,
				campaignTitle: reportData.title,
				campaignUrl: `https://app.voicedeck.org/reports/${reportData.slug}`,
				donationDate: new Date().toISOString(),
				donorName: "Donor!",
				email,
			});
		}

		revalidatePath("/reports/[slug]");
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
