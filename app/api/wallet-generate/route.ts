import { PrivyClient } from "@privy-io/server-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	console.log("req", req);
	const privy = new PrivyClient(
		process.env.PRIVY_APP_ID ?? "",
		process.env.PRIVY_APP_SECRET ?? "",
	);

	const { email } = await req.json();

	if (!email) {
		console.log("Missing required fields");
		return NextResponse.json(
			{ error: "Missing required fields" },
			{ status: 400 },
		);
	}

	const wallet = await privy.importUser({
		linkedAccounts: [
			{
				type: "email",
				address: email,
			},
		],
		createEthereumWallet: true,
	});

	return NextResponse.json({ ...wallet }, { status: 200 });
}
