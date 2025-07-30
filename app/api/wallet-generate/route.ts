import { PrivyClient } from "@privy-io/server-auth";
import { type NextRequest, NextResponse } from "next/server";

// Define CORS headers
const corsHeaders = {
	"Access-Control-Allow-Origin": "*", // Change to your domain in production
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers":
		"Content-Type, Authorization, X-Requested-With, Accept, Origin",
	"Access-Control-Max-Age": "86400",
};

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
	return new NextResponse(null, {
		status: 200,
		headers: corsHeaders,
	});
}

export async function POST(req: NextRequest) {
	console.log("req", req);

	try {
		const privy = new PrivyClient(
			process.env.PRIVY_APP_ID ?? "",
			process.env.PRIVY_APP_SECRET ?? "",
		);

		const { email } = await req.json();

		if (!email) {
			console.log("Missing required fields");
			return NextResponse.json(
				{ error: "Missing required fields" },
				{
					status: 400,
					headers: corsHeaders,
				},
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

		return NextResponse.json(
			{ ...wallet },
			{
				status: 200,
				headers: corsHeaders,
			},
		);
	} catch (error) {
		console.error("Error creating wallet:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{
				status: 500,
				headers: corsHeaders,
			},
		);
	}
}
