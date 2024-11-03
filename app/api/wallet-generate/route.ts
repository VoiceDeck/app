// import { PrivyClient } from "@privy-io/server-auth";
// import { type NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
// 	const privy = new PrivyClient(
// 		process.env.PRIVY_APP_ID ?? "",
// 		process.env.PRIVY_APP_SECRET ?? "",
// 	);
// 	console.log(process.env.PRIVY_APP_ID, process.env.PRIVY_APP_SECRET);
// 	console.log({ privy });
// 	const { address } = await req.json();
// 	console.log("address", address);

// 	if (!address) {
// 		console.log("Missing required fields");
// 		return NextResponse.json(
// 			{ error: "Missing required fields" },
// 			{ status: 400 },
// 		);
// 	}

// 	const wallet = await privy.importUser({
// 		linkedAccounts: [
// 			{
// 				type: "email",
// 				address: address,
// 			},
// 		],
// 		createEthereumWallet: true,
// 	});
	
// 	return NextResponse.json({ wallet }, { status: 200 });
// }
