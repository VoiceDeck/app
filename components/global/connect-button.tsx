"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";

import { Button } from "@/components/ui/button";
import { DEFAULT_CHAIN_ID } from "@/config/constants";
import { config } from "@/config/wagmi";
import { useLogin, useLogout, useWallets } from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { disconnect } from "@wagmi/core";
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
			const wallet = user.linkedAccounts.filter((a) => a.type === "wallet")[0];
			console.log("wallet", wallet);
			if (wallet.address) {
				console.log("wallets", wallets);
				const newActiveWallet = wallets.find(
					(wallet) => wallet.address === user.wallet?.address,
				);
				if (newActiveWallet) {
					console.log("newActiveWallet", newActiveWallet);
					console.log("chainId", newActiveWallet.chainId);

					await setActiveWallet(newActiveWallet);
					const chainId = newActiveWallet.chainId;
					if (chainId !== DEFAULT_CHAIN_ID.toString()) {
						await newActiveWallet.switchChain(DEFAULT_CHAIN_ID);
					}
				}
			}
			setIsLogin(true);
		},

		onError: async (error) => {
			console.log("error while logging in...", error);
			await disconnect(config);
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
