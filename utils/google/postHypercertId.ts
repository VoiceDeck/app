import { getSheetsInstance } from "./auth";

const postHypercertId = async (hypercertId: string) => {
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
			values: [[hypercertId, "FALSE"]], // Append a new row with the value and FALSE
		},
	});

	const data = response;
	console.log("Data added to sheet:", data);
	if (!data) {
		throw new Error("No data found");
	}
};

export { postHypercertId };
