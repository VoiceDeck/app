import { google } from "googleapis";

async function getAuthClient() {
	const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
	const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;

	if (!CLIENT_ID) {
		throw new Error("Missing Google client ID");
	}
	if (!API_KEY) {
		throw new Error("Missing Google client secret");
	}

	return new google.auth.GoogleAuth({
		keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, // if using service account
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
	});
}

export async function getSheetsInstance() {
	const authClient = await getAuthClient();
	const sheets = google.sheets({ version: "v4", auth: authClient });
	return sheets;
}
