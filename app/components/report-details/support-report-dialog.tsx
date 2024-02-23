import { Report } from "~/types";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";

const SupportReportDialog = ({
	image: reportImage,
	title: reportTitle,
}: Partial<Report>) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size={"lg"} variant={"default"}>
					Support this report
				</Button>
			</DialogTrigger>
			<DialogContent>
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
						<Button size={"lg"} variant={"default"} className="w-full">
							Connect wallet
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export { SupportReportDialog };
