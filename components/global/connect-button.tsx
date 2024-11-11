"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";

import { Button } from "@/components/ui/button";
import { useLogin, useLogout, useWallets } from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { UserPlus } from "lucide-react";
import { useState } from "react";

const ConnectButton = () => {
	// const { open } = useWeb3Modal();
	const [isLogin, setIsLogin] = useState(false);

	const { logout } = useLogout({
		onSuccess: () => {
			console.log("User logged out");
			setIsLogin(false);
		},
	});
	const { wallets, ready } = useWallets();
	const { setActiveWallet } = useSetActiveWallet();

	const { login } = useLogin({
		onComplete: async (user) => {
			console.log("user logged in...", user);

			if (user.wallet?.address && ready) {
				console.log("wallets", wallets);
				const newActiveWallet = wallets.find(
					(wallet) => wallet.address === user.wallet?.address,
				);
				if (newActiveWallet) {
					await setActiveWallet(newActiveWallet);
				}
			}
			setIsLogin(true);
		},
		onError: (error) => {
			console.log("error while logging in...", error);
			setIsLogin(false);
		},
	});

	return (
		<div>
			<Button onClick={login}>Connect Wallet</Button>
		</div>
	);
};
ConnectButton.displayName = "ConnectButton";

export { ConnectButton };
