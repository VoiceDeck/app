"use client";

import { CopyButton } from "@/components/copy-button";
import { truncateEthereumAddress } from "@/lib/utils";
import { useEnsName } from "wagmi";

export default function EthAddress({
	address,
	showEnsName = false,
}: {
	address?: string | undefined | null;
	showEnsName?: boolean;
}) {
	const { data: ensName } = useEnsName({
		address: address as `0x${string}` | undefined,
		chainId: 1,
	});

	if (!address) {
		return <div>Unknown</div>;
	}

	const copyAddress = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
		void navigator.clipboard.writeText(address);
	};

	return (
		<div className="flex w-max cursor-pointer content-center items-center gap-2 rounded-md bg-slate-100 px-1 py-0.5 text-sm">
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div onClick={copyAddress}>
				{showEnsName && ensName
					? ensName
					: truncateEthereumAddress(address as `0x${string}`)}
			</div>
			<CopyButton
				textToCopy={address}
				className="h-4 w-4 bg-transparent focus:scale-90 focus:opacity-70"
			/>
		</div>
	);
}
