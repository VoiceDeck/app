"use client";
import { useRouter } from "next/navigation";

import { useAccount, useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useEffect } from "react";

const UserInfo = () => {
	const { open } = useWeb3Modal();
	const { address, isConnected, isConnecting, isDisconnected } = useAccount();
	const router = useRouter();
	const { data: ensName } = useEnsName({
		chainId: mainnet.id,
		address: address,
	});

	useEffect(() => {
		if (!isConnected) {
			// If not connected, redirect to /reports
			router.push("/reports");
		}
	}, [isConnected, router]);

	// * Commented out the code to add the ability to connect wallet from this page
	//   if (isConnecting) return <div>Connecting…</div>;
	//   if (isDisconnected)
	//     return (
	//       <section className="h-40 w-full flex justify-center items-center">
	//         <Button onClick={() => open()}>Connect Wallet</Button>
	//       </section>
	//     );
	return (
		<>
			<section className="flex flex-col gap-4 md:gap-0">
				<h2 className="text-xl md:text-2xl font-semibold md:py-6">Profile</h2>
				<div className="flex flex-col gap-2 md:col-start-1 md:col-span-2 md:mt-2">
					<Label htmlFor="displayName">Display Name</Label>
					<Input
						className="mb-0"
						type="displayName"
						placeholder={ensName ? ensName : "Voice Deck"}
						disabled={ensName ? true : false}
					/>
					<small className="text-xs">
						We'll use your ENS name if you have one or you can set your own in
						the future.
					</small>
				</div>
				<h2 className="text-xl md:text-2xl font-semibold md:py-6">Account</h2>
				<div className="flex flex-col gap-2 md:col-start-1 md:col-span-2 md:mt-2">
					<Label htmlFor="address">Wallet Address</Label>
					<Input
						className="disabled:bg-vd-blue-300"
						type="address"
						placeholder="Address"
						value={address}
						disabled
					/>
					<small className="text-xs">
						Where you fund will be store on the blockchain.
					</small>
				</div>
			</section>
			<Separator />
		</>
	);
};

UserInfo.displayName = "UserInfo";

export { UserInfo };
