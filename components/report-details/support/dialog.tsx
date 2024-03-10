import type { Report, SupportReportInfo } from "@/types";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "../../ui/dialog";

import { useAccount } from "wagmi";
import ConnectButton from "../../connect-button";
import { Separator } from "../../ui/separator";
import SupportReportForm from "./form";

const SupportDialogContent = ({
	address,
	isConnected,
	drawerContainer,
	hypercertId,
}: {
	address: `0x${string}` | undefined;
	isConnected: boolean;
	drawerContainer: HTMLDivElement | null;
	hypercertId: Partial<Report>["hypercertId"];
}) => {
	if (!isConnected && !address) {
		return (
			<div className="flex flex-col gap-4 p-4">
				<div className="flex flex-col gap-4 justify-center items-center">
					<h4 className="font-bold text-center">
						Connect your wallet to support this report
					</h4>
					<ConnectButton />
				</div>
			</div>
		);
	}
	return (
		<>
			<SupportReportForm
				drawerContainer={drawerContainer}
				hypercertId={hypercertId}
			/>
		</>
	);
};

const SupportReportDialog = ({
	image: reportImage,
	title: reportTitle,
	hypercertId,
}: SupportReportInfo) => {
	const [drawerContainer, setDrawerContainer] = useState<HTMLDivElement | null>(
		null,
	);

	const { address, isConnected } = useAccount();

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size={"lg"} variant={"default"}>
					Support this report
				</Button>
			</DialogTrigger>
			<DialogContent
				ref={(el) => setDrawerContainer(el)}
				className="overflow-clip"
			>
				<DialogHeader className="text-xl font-bold">
					Support this report
				</DialogHeader>
				<div className="flex flex-col gap-4 p-4">
					<Card className="bg-slate-50">
						<div className="flex flex-col gap-4 p-4">
							<div className="flex justify-center">
								<img
									src={reportImage}
									alt={reportTitle}
									className="w-full h-24 object-cover rounded-lg"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<h4 className="font-bold">{reportTitle}</h4>
							</div>
						</div>
					</Card>
					<div>
						<Separator orientation="horizontal" />
					</div>
					<SupportDialogContent
						address={address}
						isConnected={isConnected}
						drawerContainer={drawerContainer}
						hypercertId={hypercertId}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export { SupportReportDialog };
