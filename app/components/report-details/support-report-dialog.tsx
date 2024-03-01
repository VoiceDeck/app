import { Loader } from "lucide-react";
import { useState } from "react";
import { Report } from "~/types";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "../ui/dialog";

import { Drawer } from "vaul";
import { Separator } from "../ui/separator";

const SupportProcessingDrawer = ({
	container,
}: { container: HTMLDivElement | null }) => {
	return (
		<Drawer.Root dismissible={false}>
			<Drawer.Trigger asChild>
				<Button size={"lg"} variant={"default"}>
					Support this report
				</Button>
			</Drawer.Trigger>
			<Drawer.Portal container={container}>
				<Drawer.Overlay className="fixed inset-0 bg-stone-900/60" />
				<Drawer.Content className="bg-stone-100 flex flex-col rounded-t-xl max-h-[50%] fixed bottom-0 left-0 right-0 after:hidden">
					<div className="flex flex-col gap-4 px-4 py-6">
						<div className="flex justify-center animate-spin">
							<Loader />
						</div>
						<div className="flex flex-col gap-4">
							<h4 className="font-bold text-center">Processing your support</h4>
							<p className="text-center">
								Please wait while we process your support. This may take a few
								seconds.
							</p>
						</div>
					</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	);
};

const SupportReportDialog = ({
	image: reportImage,
	title: reportTitle,
}: Partial<Report>) => {
	const [drawerContainer, setDrawerContainer] = useState<HTMLDivElement | null>(
		null,
	);
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
					<form className="flex flex-col gap-4">
						<div>
							<label
								htmlFor="amount"
								className="block text-sm font-semibold text-vd-blue-900"
							>
								Amount
							</label>
							<input
								type="number"
								id="amount"
								name="amount"
								className="w-full px-4 py-2 border border-vd-blue-400 rounded-lg"
							/>
						</div>
						<div>
							<label
								htmlFor="message"
								className="block text-sm font-semibold text-vd-blue-900 py-1"
							>
								Message (optional)
							</label>
							<textarea
								id="message"
								name="message"
								rows={3}
								className="w-full px-4 py-2 border border-vd-blue-400 rounded-lg resize-none"
							/>
						</div>
						<div>
							<label
								htmlFor="hide-name"
								className="flex items-center space-x-2 py-1"
							>
								<input
									type="checkbox"
									id="hide-name"
									name="hide-name"
									className="rounded-sm"
								/>
								<span className="text-sm text-vd-blue-900">Hide my name</span>
							</label>
						</div>
						<div>
							<label
								htmlFor="hide-amount"
								className="flex items-center space-x-2"
							>
								<input
									type="checkbox"
									id="hide-amount"
									name="hide-amount"
									className="rounded-sm"
								/>
								<span className="text-sm text-vd-blue-900">
									Hide donation amount
								</span>
							</label>
						</div>
					</form>
					<section className="flex flex-col gap-4 bg-vd-beige-100 rounded-md p-3">
						<div className="flex justify-between">
							<p className="text-sm text-vd-blue-700">Estimated time</p>
							<p className="text-sm text-vd-blue-700">20 seconds</p>
						</div>
						<div className="flex justify-between">
							<p className="text-sm text-vd-blue-700">Transaction fee</p>
							<p className="text-sm text-vd-blue-700">$0.00</p>
						</div>
						<div className="flex justify-between">
							<p className="font-semibold text-vd-blue-900 text-lg">
								You will spend
							</p>
							<p className="font-semibold text-vd-blue-900">$0.00</p>
						</div>
					</section>
					<div className="flex w-full">
						{/* <w3m-button /> */}

						{/* <Button size={"lg"} variant={"default"} className="w-full">
							Connect wallet
						</Button> */}
						<SupportProcessingDrawer container={drawerContainer} />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export { SupportReportDialog };
