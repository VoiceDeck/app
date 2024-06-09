import { getSheetsInstance } from "./auth";

const getHypercertIds = async () => {
	const spreadsheetId = process.env.GOOGLE_SHEET_ID;
	if (!spreadsheetId) {
		throw new Error("Missing Google spreadsheet ID");
	}
	const sheets = await getSheetsInstance();
	const response = await sheets.spreadsheets.values.get({
		spreadsheetId: spreadsheetId,
		range: "Sheet1!A:B",
	});

	const data = response.data.values;
	if (!data) {
		throw new Error("No data found");
	}
	// Filter the data to include only rows where the second column is 'TRUE'
	const filteredData = data
		.filter((row) => row[1] === "TRUE")
		.map((row) => row[0]);
	return filteredData;
};

export { getHypercertIds };
