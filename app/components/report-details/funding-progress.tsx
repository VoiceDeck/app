import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

interface FundingProgressProps {
	totalAmount: number;
	fundedAmount: number;
}

const FundingProgress: React.FC<FundingProgressProps> = ({
	totalAmount,
	fundedAmount,
}) => {
	const progressPercentage = (fundedAmount / totalAmount) * 100;

	return (
		<section className="px-3 py-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:justify-between bg-slate-50/80 backdrop-blur-md rounded-t-xl md:rounded-b-xl shadow-md">
			<div className="flex flex-col gap-2 flex-1">
				<Progress value={progressPercentage} />
				<div className="flex justify-between">
					<div className="text-sm text-vd-blue-600">
						<span className="text-vd-blue-900 font-semibold text-lg">
							${totalAmount}
						</span>{" "}
						total cost
					</div>
					<div className="text-sm text-vd-blue-600">
						<span className="text-vd-blue-900 font-semibold text-lg">
							${totalAmount - fundedAmount}
						</span>{" "}
						still needed
					</div>
				</div>
			</div>
			<div className="p-[2px]" />
			<Button size={"lg"} variant={"default"}>
				Support this report
			</Button>
		</section>
	);
};

export default FundingProgress;
