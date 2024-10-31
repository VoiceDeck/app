"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";

import { Button } from "@/components/ui/button";
import { useLogin, useLogout } from "@privy-io/react-auth";
import { useState } from "react";

const ConnectButton = () => {
	const { open } = useWeb3Modal();
	const [isLogin, setIsLogin] = useState(false);

	const { logout } = useLogout({
		onSuccess: () => {
			console.log("User logged out");
			setIsLogin(false);
		},
	});

	const { login } = useLogin({
		onComplete: (user) => {
			console.log(user);
			setIsLogin(true);
		},
		onError: (error) => {
			console.log("error while logging in...", error);
		},
	});

	return (
		<div>
			<Button onClick={() => open()}>Connect Wallet</Button>
			{!isLogin ? (
				<Button onClick={() => login({ loginMethods: ["email"] })}>
					Login
				</Button>
			) : (
				<Button onClick={() => logout()}>LogOut</Button>
			)}
		</div>
	);
};
ConnectButton.displayName = "ConnectButton";

export { ConnectButton };
