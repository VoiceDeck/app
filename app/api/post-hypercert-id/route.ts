import { postHypercertId } from "@/utils/google/postHypercertId";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Handles a POST request to update a dashboard in the database.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response to be sent back.
 */
export async function POST(req: NextRequest) {
	try {
		// Destructure the required fields from the request JSON
		const { hypercertId } = await req.json();

		const googleSheetData = await postHypercertId(hypercertId);

		NextResponse.json(googleSheetData);
	} catch (error) {
		// Log error and return 500 status code with the error message
		return NextResponse.json(error, { status: 500 });
	}
}
