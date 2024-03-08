'use client'
import { useAccount } from "wagmi";
import { Progress } from "../ui/progress";
import { SupportReportDialog } from "./support-report-dialog";

interface FundingProgressProps {
	totalAmount: number;
	fundedAmount: number;
	reportImage: string;
	reportTitle: string;
}

const FundingProgress: React.FC<FundingProgressProps> = ({
	totalAmount,
	fundedAmount,
	reportImage,
	reportTitle,
}) => {
	const progressPercentage = (fundedAmount / totalAmount) * 100;
	const isFullyFunded = progressPercentage === 100;
	// const [supportActionContent, setSupportActionContent] =
	// 	useState<React.ReactNode>(null);

	// useEffect(() => {
	// 	let content: React.ReactNode;

	// 	if (isFullyFunded) {
	// 		content = (
	// 			<p className="uppercase font-bold text-green-600 p-3 text-center">
	// 				Fully funded!
	// 			</p>
	// 		);
	// 	} else if (status === 'connected') {
	// 		content = <SupportReportDialog image={reportImage} title={reportTitle} />;
	// 	} else {
	// 		content = ( <ConnectButton />);
	// 	}

	// 	setSupportActionContent(content);
	// }, [
	// 	status,
	// 	address,
	// 	isFullyFunded,
	// 	reportImage,
	// 	reportTitle,
	// ]);

	// const SupportActionDynamic = () => {
	// 	if (isFullyFunded) {
	// 		return (
	// 			<p className="uppercase font-bold text-green-600 p-3 text-center">
	// 				Fully funded!
	// 			</p>
	// 		);
	// 	}

	// 	if (isDisconnected || !address)
	// 		return <p className="p-2 bg-vd-beige-300">Connect wallet to support</p>;

	// 	if (
	// 		isConnected &&
	// 		address &&
	// 		!isFullyFunded &&
	// 		user?.wallet
	// 	)
	// 		return <SupportReportDialog image={reportImage} title={reportTitle} />;
	// };

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
			<SupportReportDialog image={reportImage} title={reportTitle} />
		</section>
	);
};

export default FundingProgress;
