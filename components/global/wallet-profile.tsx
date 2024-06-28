"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Link from "next/link";
import { normalize } from "viem/ens";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, truncateEthereumAddress } from "@/lib/utils";
import { Loader2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { mainnet } from "viem/chains";
import { ConnectButton } from "./connect-button";

const WalletProfile = ({
	alignment = "end",
}: { alignment?: "end" | "center" | "start" }) => {
	const { open } = useWeb3Modal();
	const { address, isConnecting, isDisconnected } = useAccount();
	const [ensName, setEnsName] = useState<string | undefined>(undefined);
	const [ensAvatar, setEnsAvatar] = useState<string | undefined>(undefined);

	const { data: nameData, error: nameError } = useEnsName({
		chainId: address ? mainnet.id : undefined,
		address,
	});

	// Use useEffect to react to nameData changes and setEnsName
	useEffect(() => {
		if (!nameError && nameData) {
			setEnsName(nameData);
		}
	}, [nameData, nameError]);

	// Call useEnsAvatar with the normalized nameData when available
	const { data: avatarData, error: avatarError } = useEnsAvatar({
		chainId: nameData ? mainnet.id : undefined,
		name: nameData ? normalize(nameData) : undefined,
	});

	// Use useEffect to react to avatarData changes and setEnsAvatar
	useEffect(() => {
		if (!avatarError && avatarData) {
			setEnsAvatar(avatarData);
		}
	}, [avatarData, avatarError]);

	if (isConnecting) return <Loader2 className="animate-spin" />;
	if (isDisconnected) return <ConnectButton />;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				asChild
				className={cn(
					"relative h-10 w-10 cursor-pointer overflow-hidden rounded-full ring-[1.5px] focus:outline-none focus:ring-2",
				)}
			>
				<Avatar className="h-10 w-10 bg-stone-50">
					{ensAvatar && (
						<AvatarImage
							src={ensAvatar}
							alt="ENS Avatar"
							className="object-cover object-center"
						/>
					)}
					<AvatarFallback>
						<UserRound />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align={alignment} forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						{ensName && (
							<p className="font-medium text-sm leading-none">{ensName}</p>
						)}
						<p className="text-muted-foreground text-xs leading-none">
							{address ? truncateEthereumAddress(address) : "No address"}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<Link href={`/profile/${address}`}>
						<DropdownMenuItem className="cursor-pointer">
							Profile
						</DropdownMenuItem>
					</Link>
					<Link href={`/profile/${address}/settings`}>
						<DropdownMenuItem className="cursor-pointer">
							Settings
						</DropdownMenuItem>
					</Link>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="cursor-pointer" onClick={() => open()}>
					Disconnect
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

WalletProfile.displayName = "WalletProfile";

export { WalletProfile };
