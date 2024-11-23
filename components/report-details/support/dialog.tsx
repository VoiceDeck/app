"use client";

import { ConnectButton } from "@/components/global/connect-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { SupportReportInfo } from "@/types";
import { DooglyDonateButton } from "@doogly/doogly-donate-component";
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
	hypercertId,
}: {
	address: `0x${string}` | undefined;
	isConnected: boolean;
	hypercertId: SupportReportInfo["hypercertId"];
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
	// TODO: remove this when we don't need dummy order
	if (process.env.NEXT_PUBLIC_DEPLOY_ENV === "production") {
		return <SupportReportForm hypercertId={hypercertId} />;
	}
	return (
		<SupportReportForm
			hypercertId={
				"0xa16dfb32eb140a6f3f2ac68f41dad8c7e83c4941-39472754562828861761751454462085112528896"
			}
		/>
	);
};

const ReportSupportUI = ({
	image: reportImage,
	title: reportTitle,
	hypercertId,
	open,
	setOpen,
	UIComponent,
	ContentComponent,
	HeaderComponent,
}: SupportDrawerDialogProps & {
	UIComponent: React.ElementType;
	ContentComponent: React.ElementType;
	HeaderComponent: React.ElementType;
}) => {
	const { address, isConnected } = useAccount();

	const commonProps = {
		open,
		onOpenChange: setOpen,
		trigger: (
			<Button size={"lg"} variant={"default"}>
				Support this report
			</Button>
		),
		header: "Support this report",
		content: (
			<div className="flex flex-col gap-3">
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
					hypercertId={hypercertId}
				/>
			</div>
		),
	};

	return (
		<UIComponent open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{commonProps.trigger}</DialogTrigger>
			<ContentComponent>
				<HeaderComponent>
					<h3 className="font-bold text-lg">{commonProps.header}</h3>
				</HeaderComponent>
				{commonProps.content}
			</ContentComponent>
		</UIComponent>
	);
};

const SupportReport = ({
	image: reportImage,
	title: reportTitle,
	hypercertId,
}: SupportReportInfo) => {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const props = {
		image: reportImage,
		title: reportTitle,
		hypercertId,
		open,
		setOpen,
	};

	// if (isDesktop) {
	// 	return (
	// 		<ReportSupportUI
	// 			{...props}
	// 			UIComponent={Dialog}
	// 			ContentComponent={DialogContent}
	// 			HeaderComponent={DialogHeader}
	// 		/>
	// 	);
	// }

	// return (
	// 	<ReportSupportUI
	// 		{...props}
	// 		UIComponent={Drawer}
	// 		ContentComponent={(props) => (
	// 			<DrawerContent {...props} className="bg-vd-beige-100 p-3" />
	// 		)}
	// 		HeaderComponent={DrawerHeader}
	// 	/>
	// );
	return (
		<DooglyDonateButton
			buttonText="Support this report"
			modalTitle="Support this report"
			config={{
				destinationChain: "optimism",
				destinationAddress: "0x8a4c14d50c43363a28647188534db7004112091c",
				splitsAddress: "0xD8813c65a4A21772C360f32B2C7960040fa84a8B",
				hypercertFractionId: "18669251778750367859454584462136531153321984",
				poolId: 0,
			}}
			buttonClassName="rounded-3xl bg-vd-blue-900 text-vd-beige-100 hover:bg-vd-blue-700 dark:bg-vd-beige-100 dark:text-vd-blue-900 dark:hover:bg-vd-beige-100/90 active:outline-none active:scale-95 active:ring-2 active:ring-vd-blue-400 active:ring-offset-2"
			modalStyles={{
				backgroundColor: "#FAF7F5",
				headingColor: "#252E56",
				textColor: "#252E56",
				buttonColor: "#252F55",
			}}
		/>
	);
};

export { SupportReport };
