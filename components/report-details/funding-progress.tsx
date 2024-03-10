"use client";
import type { SupportReportInfo } from "@/types";
import { Progress } from "../ui/progress";
import { SupportReportDialog } from "./support/dialog";

interface FundingProgressProps {
	totalAmount: number;
	fundedAmount: number;
	reportInfo: SupportReportInfo;
}

const FundingProgress: React.FC<FundingProgressProps> = ({
	totalAmount,
	fundedAmount,
	reportInfo,
}) => {
	const progressPercentage = (fundedAmount / totalAmount) * 100;
	const isFullyFunded = progressPercentage === 100;

	return (
		<section className="px-3 py-4 flex flex-col space-y-2 md:flex-row md:space-x-4 md:justify-between bg-slate-50/80 backdrop-blur-md rounded-t-xl md:rounded-b-xl shadow-md max-w-3xl">
			<div className="flex flex-col gap-2 flex-1">
				<div className="flex justify-between">
					<div className="text-sm text-vd-blue-600 flex-1">
						<span className="text-vd-blue-900 font-semibold text-lg">
							${totalAmount}
						</span>{" "}
						GOAL
					</div>
					{!isFullyFunded && (
						<div className="text-sm text-vd-blue-600">
							<span className="text-vd-blue-900 font-semibold text-lg">
								${totalAmount - fundedAmount}
							</span>{" "}
							NEEDED
						</div>
					)}
				</div>
				<Progress value={progressPercentage} />
			</div>
			<div className="p-[2px]" />
			{/* {supportActionContent} */}
			<SupportReportDialog
				image={reportInfo.image}
				title={reportInfo.title}
				hypercertId={reportInfo.hypercertId}
			/>
		</section>
	);
};

export default FundingProgress;
