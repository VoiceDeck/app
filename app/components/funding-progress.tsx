import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

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
		<section className="px-3 py-4 flex flex-col space-y-2 bg-slate-50/80 backdrop-blur-md rounded-t-xl">
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
			<div className="p-[2px]" />
			<Button size={"lg"} variant={"default"}>
				Support this report
			</Button>
		</section>
	);
};

export default FundingProgress;
