import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { useEffect } from "react";
import { User } from "types/user";
import { useAccount, useDisconnect } from "wagmi";
import { z } from "zod";
import { Footer } from "~/components/global/footer";
import { NavMenu } from "~/components/global/nav-menu";
import { login, requireAuthedUser } from "~/lib/services/auth.server";
import { formAction } from "~/lib/services/form.server";

const schema = z.object({
	didSession: z.string(),
	wallet: z.string(),
});
const mutation = makeDomainFunction(schema)(async (values) => {
	return values;
});

export const action = async ({ request }: ActionFunctionArgs) => {
	const resp = await formAction({
		request,
		schema,
		mutation,
	});
	if (resp.ok) {
		await login(request);
	}
	return null;
};

export async function loader({ params, request }: LoaderFunctionArgs) {
	const { address } = params;
	const user = (await requireAuthedUser(request)) as User;
	return json({
		address,
		user,
		authedWallet: user.wallet as `0x${string}`,
	});
}

export default function AppLayout() {
	const {
		address: paramAddress,
		user,
		authedWallet,
	} = useLoaderData<typeof loader>();
	const fetcher = useFetcher();
	const { isConnected, address: connectedAddress } = useAccount();
	const { disconnect } = useDisconnect();

	useEffect(() => {
		if (!isConnected || connectedAddress !== authedWallet) {
			disconnect();
			fetcher.submit({}, { method: "post", action: "/actions/auth/logout" });
		}
	}, [isConnected, connectedAddress, authedWallet, disconnect, fetcher]);

	async function handleSignout() {
		disconnect();
		fetcher.submit({}, { method: "post", action: "/actions/auth/logout" });
	}

	return (
		<>
			<NavMenu user={user} handleSignout={handleSignout} />
			<Outlet />
			<Footer />
		</>
	);
}
