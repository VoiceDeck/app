import { getSheetsInstance } from "@/utils/google/auth";
import { postHypercertId } from "@/utils/google/postHypercertId";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	console.log("req", req);
	const body = await req.json();
	console.log("body", body);
	const { hypercertId } = body;
	console.log("hypercertId In Google Sheet:", hypercertId);
	try {
		// Destructure the required fields from the request JSON

		const spreadsheetId = process.env.GOOGLE_SHEET_ID;
		if (!spreadsheetId) {
			throw new Error("Missing Google spreadsheet ID");
		}
		if (!hypercertId) {
			throw new Error("Missing hypercertId");
		}

		const sheets = await getSheetsInstance();
		const response = await sheets.spreadsheets.values.append({
			spreadsheetId,
			range: "Sheet1!A:B",
			valueInputOption: "USER_ENTERED",
			requestBody: {
				values: [[hypercertId, "FALSE"]], // Append a new row with the value and FALSE to mark it as not approved
			},
		});

		const { data } = response;
		console.log("Data added to sheet:", data);
		if (!data) {
			throw new Error("No data found");
		}

		return NextResponse.json(data);
	} catch (error) {
		// Log error and return 500 status code with the error message
		return NextResponse.json(error, { status: 500 });
	}
}
