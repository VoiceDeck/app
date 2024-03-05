import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "@remix-run/react";
import { HandIcon, LogOut } from "lucide-react";
import { MetaMaskAvatar } from "react-metamask-avatar";
import type { User } from "types/user";
import { useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils/misc";

interface AccountButtonProps {
	user?: User | null;
	size?: "sm" | "default" | "lg";
	handleSignOut: () => void;
	className?: string;
}

export function AccountButton({
	user,
	size = "default",
	handleSignOut,
	className,
}: AccountButtonProps) {
	const { switchChain } = useSwitchChain();

	const handleSwitch = () => {
		if (switchChain) {
			switchChain({ chainId: sepolia.id });
		}
	};

	return (
		<ConnectButton.Custom>
			{({
				account,
				chain,
				authenticationStatus,
				mounted,
				openConnectModal,
			}) => {
				const ready = mounted && authenticationStatus !== "loading";
				const connected =
					ready &&
					account &&
					chain &&
					(!authenticationStatus || authenticationStatus === "authenticated");

				if (!user && !ready) {
					return (
						<Button onClick={openConnectModal} type="button">
							Connect Wallet
						</Button>
					);
				}
				if (connected && chain?.id !== sepolia.id) {
					return (
						<Button
							size={size}
							variant="outline"
							className={cn(className)}
							onClick={handleSwitch}
						>
							Wrong Network
						</Button>
					);
				}
				return (
					<div
						{...(!ready && {
							"aria-hidden": true,
							style: {
								opacity: 0,
								pointerEvents: "none",
								userSelect: "none",
							},
						})}
					>
						{connected && !!user ? (
							<div className="flex gap-2 rounded-full p-1 bg-vd-beige-400">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											size={"icon"}
											variant="ghost"
											className={cn(
												className,
												"h-8 w-8 overflow-hidden rounded-full transition-transform hover:scale-105",
											)}
										>
											<div className="flex items-center gap-1">
												<MetaMaskAvatar
													address={account?.address || ""}
													size={40}
													className="rounded-full"
												/>
											</div>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="bg-vd-beige-200 w-48"
									>
										<DropdownMenuLabel className="flex items-center gap-2">
											<div className="space-y-1">
												<div className="text-sm font-normal text-primary-500">
													Signed in as:
												</div>
												<div className="font-semibold">
													{account?.displayName}
												</div>
											</div>
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem className="hover:bg-vd-beige-300 cursor-pointer hover:font-medium">
											<Link
												to={"/app/my-actions"}
												className="flex justify-start items-center w-full h-full"
											>
												<HandIcon className="mr-2 h-4 w-4 " />
												My actions
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem
											onSelect={(e) => {
												e.preventDefault();
												handleSignOut();
											}}
											className="cursor-pointer justify-start"
										>
											<LogOut className="mr-2 h-4 w-4" />
											<span>
												{user.didSession && "Sign Out"}
												{connected && !user.didSession && "Disconnect"}
											</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						) : null}
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
}
