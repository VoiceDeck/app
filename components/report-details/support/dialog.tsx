import { ConnectButton } from "@/components/global/connect-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { Report, SupportReportInfo } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";
import SupportReportForm from "./form";

interface SupportDrawerDialogProps extends SupportReportInfo {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SupportContent = ({
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
			<div className="flex flex-col gap-4 p-3">
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
		<SupportReportForm
			drawerContainer={drawerContainer}
			hypercertId={hypercertId}
		/>
	);
};

const SupportReportDialog = ({
	image: reportImage,
	title: reportTitle,
	hypercertId,
	open,
	setOpen,
}: SupportDrawerDialogProps) => {
	const [drawerContainer, setDrawerContainer] = useState<HTMLDivElement | null>(
		null,
	);

	const { address, isConnected } = useAccount();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size={"lg"} variant={"default"}>
					Support this report
				</Button>
			</DialogTrigger>
			<DialogContent
				ref={(el) => setDrawerContainer(el)}
				className="overflow-clip"
			>
				<DialogHeader className="text-2xl font-bold">
					Support this report
				</DialogHeader>
				<div className="flex flex-col gap-4 p-3">
					<Card className="bg-slate-50">
						<div className="flex items-center gap-4 p-2">
							{/* <div className="flex justify-center"> */}
							{reportImage && reportTitle && (
								<div className="relative w-24 h-16 overflow-hidden rounded-md border">
									<Image
										src={reportImage}
										alt={reportTitle}
										fill
										style={{ objectFit: "cover", objectPosition: "center" }}
									/>
								</div>
							)}
							<div className="flex flex-col gap-2">
								<h4 className="font-bold text-base line-clamp-2">
									{reportTitle}
								</h4>
							</div>
						</div>
					</Card>
					<Separator />
					<SupportContent
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

const SupportReportDrawer = ({
	image: reportImage,
	title: reportTitle,
	hypercertId,
	open,
	setOpen,
}: SupportDrawerDialogProps) => {
	const [drawerContainer, setDrawerContainer] = useState<HTMLDivElement | null>(
		null,
	);

	const { address, isConnected } = useAccount();

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button size={"lg"} variant={"default"}>
					Support this report
				</Button>
			</DrawerTrigger>
			<DrawerContent
				ref={(el) => setDrawerContainer(el)}
				className="overflow-clip bg-vd-beige-100"
			>
				<DrawerHeader className="text-2xl font-bold">
					Support this report
				</DrawerHeader>
				<div className="flex flex-col gap-4 p-3">
					<Card className="bg-slate-50">
						<div className="flex items-center gap-4 p-2">
							{reportImage && reportTitle && (
								<div className="relative w-24 h-16 overflow-hidden rounded-md border">
									<Image
										src={reportImage}
										alt={reportTitle}
										fill
										style={{ objectFit: "cover", objectPosition: "center" }}
									/>
								</div>
							)}
							<div className="flex flex-col gap-2">
								<h4 className="font-bold text-base line-clamp-2">
									{reportTitle}
								</h4>
							</div>
						</div>
					</Card>
					<Separator />
					<SupportContent
						address={address}
						isConnected={isConnected}
						drawerContainer={drawerContainer}
						hypercertId={hypercertId}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

const SupportReport = ({
	image: reportImage,
	title: reportTitle,
	hypercertId,
}: SupportReportInfo) => {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<SupportReportDialog
				image={reportImage}
				title={reportTitle}
				hypercertId={hypercertId}
				open={open}
				setOpen={setOpen}
			/>
		);
	}

	return (
		<SupportReportDrawer
			image={reportImage}
			title={reportTitle}
			hypercertId={hypercertId}
			open={open}
			setOpen={setOpen}
		/>
	);
};

export { SupportReport };
