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
	reportTitle,
	reportImage,
}: {
	address: `0x${string}` | undefined;
	isConnected: boolean;
	reportTitle?: string;
	reportImage?: string;
	hypercertId: SupportReportInfo["hypercertId"];
}) => {
	// if (!isConnected && !address) {
	// 	return (
	// 		<div className="flex flex-col gap-4 p-3">
	// 			<div className="flex flex-col gap-4 justify-center items-center">
	// 				<h4 className="font-bold text-center">
	// 					Connect your wallet to support this report
	// 				</h4>
	// 				<ConnectButton />
	// 			</div>
	// 		</div>
	// 	);
	// }
	// TODO: remove this when we don't need dummy order
	if (process.env.NEXT_PUBLIC_DEPLOY_ENV === "production") {
		return (
			<SupportReportForm
				hypercertId={hypercertId}
				reportImage={reportImage}
				reportTitle={reportTitle}
			/>
		);
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
			<Button size={"lg"} variant={"default"} className="gap-2">
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					role="img"
					aria-label="Heart icon"
				>
					<path
						d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
						fill="currentColor"
					/>
				</svg>
				Support this report
			</Button>
		),
		header: "Support this report",
		content: (
			<div className="flex flex-col gap-4">
				{reportImage && reportTitle && (
					<Card className="bg-gradient-to-r from-gray-50 to-vd-beige-100 border-vd-beige-300">
						<div className="flex items-center gap-4 p-4">
							<div className="relative w-20 h-16 overflow-hidden rounded-lg border-2 border-white shadow-sm">
								<Image
									src={reportImage}
									alt={reportTitle}
									fill
									style={{ objectFit: "cover", objectPosition: "center" }}
								/>
							</div>
							<div className="flex-1">
								<h4 className="font-bold text-base line-clamp-2 text-vd-blue-900">
									{reportTitle}
								</h4>
								<p className="text-sm text-vd-blue-600 mt-1">
									Women Allowed to Work in Government Program
								</p>
							</div>
						</div>
					</Card>
				)}
				<Separator />
				<SupportContent
					address={address}
					reportTitle={reportTitle}
					reportImage={reportImage}
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
					<h3 className="font-bold text-xl text-center">
						{commonProps.header}
					</h3>
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
	defaultOpenModal = false,
}: SupportReportInfo) => {
	const [open, setOpen] = useState(defaultOpenModal);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const props = {
		image: reportImage,
		title: reportTitle,
		hypercertId,
		open,
		setOpen,
	};

	if (isDesktop) {
		return (
			<ReportSupportUI
				{...props}
				UIComponent={Dialog}
				ContentComponent={DialogContent}
				HeaderComponent={DialogHeader}
			/>
		);
	}

	return (
		<ReportSupportUI
			{...props}
			UIComponent={Drawer}
			ContentComponent={(props) => (
				<DrawerContent
					{...props}
					className="bg-white p-4 max-h-[90vh] overflow-y-auto"
				/>
			)}
			HeaderComponent={DrawerHeader}
		/>
	);
};

export { SupportReport };
