import { google } from "googleapis";

async function getAuthClient() {
	const projectId = process.env.GOOGLE_PROJECT_ID;
	const privateKey = process.env.GOOGLE_PRIVATE_KEY;
	const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

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
		projectId: projectId,
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
		credentials: {
			client_email: clientEmail,
			private_key: privateKey.split(String.raw`\n`).join("\n"),
		},
	});
}

export async function getSheetsInstance() {
	const authClient = await getAuthClient();
	const sheets = google.sheets({ version: "v4", auth: authClient });
	return sheets;
}
