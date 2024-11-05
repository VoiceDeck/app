"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";

import { Button } from "@/components/ui/button";
import { useLogin, useLogout } from "@privy-io/react-auth";
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

	const { login } = useLogin({
		onComplete: (user) => {
			console.log("user logged in...", user);
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
