import { ConnectButton as RainbowkitConnectButton } from "@rainbow-me/rainbowkit";
import { Loader2Icon } from "lucide-react";
import type { User } from "types/user";
import { useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils/misc";

interface ConnectButtonProps {
	user?: User | null;
	size?: "sm" | "default" | "lg";
	className?: string;
}

export function ConnectButton({
	user,
	size = "default",
	className,
}: ConnectButtonProps) {
	const { switchChain } = useSwitchChain();

	const handleSwitch = () => {
		if (switchChain) {
			switchChain({ chainId: sepolia.id });
		}
	};

	return (
		<RainbowkitConnectButton.Custom>
			{({
				account,
				chain,
				openConnectModal,
				authenticationStatus,
				mounted,
			}) => {
				const ready = mounted && authenticationStatus !== "loading";
				const connected =
					ready &&
					account &&
					chain &&
					(!authenticationStatus || authenticationStatus === "authenticated");

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
						{!connected ? (
							<Button
								size={size}
								variant="default"
								className={cn(className)}
								onClick={openConnectModal}
							>
								Connect Wallet
							</Button>
						) : !user?.didSession ? (
							<Button
								disabled
								size={size}
								variant="default"
								className={cn(className)}
							>
								<Loader2Icon className="mr-1 h-5 w-5 animate-spin" /> Signing...
							</Button>
						) : chain?.id !== sepolia.id ? (
							<Button
								size={size}
								variant="default"
								className={cn(className)}
								onClick={handleSwitch}
							>
								Wrong Network
							</Button>
						) : (
							<div>{account?.displayName}</div>
						)}
					</div>
				);
			}}
		</RainbowkitConnectButton.Custom>
	);
}
