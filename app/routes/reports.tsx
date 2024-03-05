import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { useEffect, useState } from "react";
import { User } from "types/user";
import {
	useAccount,
	useDisconnect,
	useSwitchChain,
	useWalletClient,
} from "wagmi";
import { sepolia } from "wagmi/chains";
import { z } from "zod";
import { isAuthedUser, login } from "~/lib/services/auth.server";
import { formAction } from "~/lib/services/form.server";
import { newDIDSessionFromWalletClient } from "~/lib/utils/siwe";

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

export async function loader({ request }: LoaderFunctionArgs) {
	const user = (await isAuthedUser(request)) as User;
	return json({ user });
}

export default function ReportLayout() {
	const { user } = useLoaderData<typeof loader>();
	const fetcher = useFetcher();
	const submit = useSubmit();

	const { isConnected, address, chain } = useAccount();
	const { switchChain } = useSwitchChain();
	const { disconnect } = useDisconnect();
	const { data: walletClient } = useWalletClient();

	const [hasSigned, setHasSigned] = useState<boolean>(false);
	const [didSession, setDidSession] = useState<string>("");

	async function signMessage() {
		try {
			if (walletClient) {
				const didSesh = await newDIDSessionFromWalletClient({
					account: walletClient?.account,
					signMessage: walletClient?.signMessage,
				});
				setDidSession(didSesh.serialize());
				setHasSigned(true);
			}
		} catch (e) {
			window.alert(e);
			disconnect();
			fetcher.submit({}, { method: "post", action: "/actions/auth/logout" });
		}
	}

	async function handleSignOut() {
		setHasSigned(false);
		disconnect();
		fetcher.submit({}, { method: "post", action: "/actions/auth/logout" });
	}

	function handleLogin() {
		const formData = new FormData();
		formData.set("didSession", didSession);
		formData.set("wallet", walletClient?.account?.address as string);
		submit(formData, {
			method: "post",
		});
	}

	useEffect(() => {
		if (!user && isConnected && walletClient?.account.address) {
			signMessage();
		}
		if (!isConnected || (isConnected && user && user.wallet !== address)) {
			if (isConnected) handleSignOut();
		}
	}, [user, isConnected, walletClient, address]);

	// Detect Wrong Network
	useEffect(() => {
		if (chain !== sepolia && switchChain) {
			switchChain({ chainId: sepolia.id });
		}
	}, [chain, switchChain]);

	// Trigger remix auth action if user has a did session and has signed
	useEffect(() => {
		if (hasSigned && didSession) {
			handleLogin();
		}
	}, [hasSigned, didSession]);

	return (
		<>
			<Outlet />
		</>
	);
}
