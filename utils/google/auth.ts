import { google } from "googleapis";

async function getAuthClient() {
	const projectId = process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID;
	const privateKey = process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY;
	const clientEmail = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL;

	if (!projectId) {
		throw new Error("Missing Google project ID");
	}
	if (!privateKey) {
		throw new Error("Missing Google private key");
	}
	if (!clientEmail) {
		throw new Error("Missing Google client email");
	}

	return new google.auth.GoogleAuth({
		projectId: process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID,
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
		credentials: {
			client_email: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL,
			private_key: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY,
		},
	});
}

export async function getSheetsInstance() {
	const authClient = await getAuthClient();
	const sheets = google.sheets({ version: "v4", auth: authClient });
	return sheets;
}
