import type { LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { Link, MetaFunction, useLoaderData } from "@remix-run/react";
import {
	ArrowLeft,
	ArrowUpLeftFromCircle,
	MoveLeftIcon,
	StepBack,
} from "lucide-react";
import Markdown from "react-markdown";
import FundingProgress from "~/components/funding-progress";

export interface ReportSchema {
	id: string;
	status: string;
	date_created: string;
	title: string;
	content: string;
	slug: string;
}

export const meta: MetaFunction = ({ data }: MetaArgs) => {
	const report = data as ReportSchema;
	// return [{ title: `VoiceDeck | ${report.title}` }];
	return [{ title: "VoiceDeck | Test Report" }];
};

export default function RouteComponent() {
	return (
		<main className="flex flex-col border-2 border-red-100 justify-between h-svh">
			{/* 140px is added to account for the funding progress on mobile */}
			<div className="flex flex-col space-y-2 p-4 pb-[140px]">
				<section className="flex flex-col flex-1 space-y-2 ">
					<h5 className="font-semibold uppercase text-vd-blue-500 tracking-wider">
						Report
					</h5>
					<h1 className="font-semibold text-3xl tracking-tight">
						Construction of a Dobha in Giridih District
					</h1>
					<ul className="flex flex-wrap space-x-3 space-y-2 items-center">
						<li>Weee</li>
						<li>Three</li>
						<li>Tignoy</li>
						<li>Tignoy</li>
					</ul>
					{/* <FundingProgress totalAmount={100} fundedAmount={27} /> */}

					<article>
						<h3 className="text-xl font-bold">Summary</h3>
						<p className="text-base tracking-normal opacity-90">
							The construction of a dobha in Bengai village, Giridih district,
							Jharkhand, facilitated by Mobile Vaani, has demonstrated a
							significant impact on the local farming community. The
							intervention, which involved reporting the need for a dobha to the
							government, resulted in a substantial increase in economic
							benefits for the farmers.
						</p>
						<p className="text-base tracking-normal opacity-90">
							The construction of a dobha in Bengai village, Giridih district,
							Jharkhand, facilitated by Mobile Vaani, has demonstrated a
							significant impact on the local farming community. The
							intervention, which involved reporting the need for a dobha to the
							government, resulted in a substantial increase in economic
							benefits for the farmers.
						</p>
						<p className="text-base tracking-normal opacity-90">
							The construction of a dobha in Bengai village, Giridih district,
							Jharkhand, facilitated by Mobile Vaani, has demonstrated a
							significant impact on the local farming community. The
							intervention, which involved reporting the need for a dobha to the
							government, resulted in a substantial increase in economic
							benefits for the farmers.
						</p>
						<p className="text-base tracking-normal opacity-90">
							The construction of a dobha in Bengai village, Giridih district,
							Jharkhand, facilitated by Mobile Vaani, has demonstrated a
							significant impact on the local farming community. The
							intervention, which involved reporting the need for a dobha to the
							government, resulted in a substantial increase in economic
							benefits for the farmers.
						</p>
					</article>
				</section>
			</div>
			<div className="fixed bottom-0 w-full shadow-lg">
				<FundingProgress totalAmount={100} fundedAmount={27} />
			</div>
		</main>
	);
}
