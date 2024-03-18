"use client";
import Link from "next/link";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useEnsName, useEnsAvatar } from "wagmi";
import { mainnet } from "wagmi/chains";
import { normalize } from "viem/ens";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { truncateEthereumAddress } from "@/lib/utils";

export default function ConnectButton() {
  const { open } = useWeb3Modal();
  const { address, isConnecting, isDisconnected } = useAccount();
  const { data: ensName } = useEnsName({
    chainId: mainnet.id,
    address: address,
  });
  const { data: ensAvatar } = useEnsAvatar({
    chainId: mainnet.id,
    name: normalize(ensName!),
  });
  if (isConnecting) return <div>Connecting…</div>;
  if (isDisconnected)
    return <Button onClick={() => open()}>Connect Wallet</Button>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={ensAvatar!} alt="ENS Avatar" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {ensName && (
              <p className="text-sm font-medium leading-none">{ensName}</p>
            )}
            <p className="text-xs leading-none text-muted-foreground">
              {address ? truncateEthereumAddress(address) : "No address"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/profile/${address}`}>
            <DropdownMenuItem className="cursor-pointer">
              Profile
              {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </Link>
          <Link href={`/profile/${address}/settings`}>
            <DropdownMenuItem className="cursor-pointer">
              Settings
              {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* Currently Opens Web3 modal to allow user to disconnect, can call disconnect from wagmi instead */}
        <DropdownMenuItem className="cursor-pointer" onClick={() => open()}>
          Disconnect
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
