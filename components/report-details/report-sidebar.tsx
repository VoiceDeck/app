import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	cn,
	formatDate,
	isValidEthereumAddress,
	truncateEthereumAddress,
} from "@/lib/utils";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import type { Address } from "viem";
import { Badge } from "../ui/badge";

export interface SidebarData {
	name: string;
	work_scope: string[];
	impact_timeframe_from?: Date;
	impact_timeframe_to?: Date;
	work_timeframe_to: Date;
	work_timeframe_from: Date;
	impact_scope: string[];
	image: string;
	description: string;
	external_url: string;
	contributors: string[];
	allow_list_uri: string;
	modificationTime?: Date;
	size?: number;
}

const ImpactDetails = ({
	metadata,
	hypercert_id,
}: { metadata: SidebarData; hypercert_id: string }) => {
	const details = [
		{
			title: "Work scope",
			value:
				metadata.work_scope.length > 0 ? (
					<div className="flex gap-1">
						{metadata.work_scope.map((scope) => (
							<Badge
								className="pointer-events-none hover:bg-vd-beige-200"
								variant={"secondary"}
							>
								{scope}
							</Badge>
						))}
					</div>
				) : (
					"N/A"
				),
		},
		{
			title: "Time of work",
			value:
				metadata.work_timeframe_from && metadata.work_timeframe_to ? (
					<p className="text-base">
						{metadata.work_timeframe_from === metadata.work_timeframe_to ? (
							formatDate(metadata.work_timeframe_from)
						) : (
							<>
								{formatDate(metadata.work_timeframe_from)} -
								{formatDate(metadata.work_timeframe_to)}
							</>
						)}
					</p>
				) : (
					"N/A"
				),
		},
		{
			title: "Contributors",
			value:
				metadata.contributors.length > 0
					? metadata.contributors
							.map((contributor) =>
								isValidEthereumAddress(contributor)
									? truncateEthereumAddress(contributor as Address)
									: contributor,
							)
							.join(", ")
					: "N/A",
		},
	];
	return (
		<Card className="bg-gray-100 shadow-none md:min-w-[300px]">
			<CardHeader>
				<CardTitle className="line-clamp-none font-semibold text-xl leading-none tracking-tight">
					Hypercert details
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ul>
					{details.map((detail, index) => (
						<li
							key={detail.title}
							className="border-b-[1.5px] border-b-vd-beige-200 py-4"
						>
							<p className="text-sm text-vd-blue-600">{detail.title}</p>
							{detail.value}
						</li>
					))}
				</ul>
				<a
					href={`https://testnet.hypercerts.org/app/view#claimId=${hypercert_id}`}
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						buttonVariants({ variant: "link" }),
						"group gap-1 pl-0 text-vd-orange-800 dark:hover:text-vd-beige-100 dark:text-vd-beige-100 hover:text-vd-orange-900",
					)}
				>
					<span>View Hypercert</span>
					<ArrowUpRight
						size={18}
						className="group-hover:-translate-y-0.5 opacity-70 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 group-hover:opacity-100"
						aria-hidden="true"
					/>
				</a>
				<a
					href="https://testnet.hypercerts.org/docs/intro"
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						buttonVariants({ variant: "link" }),
						"group gap-1 pl-0 text-vd-orange-800 dark:hover:text-vd-beige-100 dark:text-vd-beige-100 hover:text-vd-orange-900",
					)}
				>
					<span>What is a Hypercert?</span>
					<ArrowUpRight
						size={18}
						className="group-hover:-translate-y-0.5 opacity-70 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 group-hover:opacity-100"
						aria-hidden="true"
					/>
				</a>
			</CardContent>
		</Card>
	);
};

const EvaluationDetails = () => {
	const verifiedData = [
		{
			title: "Verified By",
			value: "Edge City core team",
			// value: report.verifiedBy || "Not Verified",
		},
	];

	return (
		<Card className="bg-white shadow-none md:min-w-[300px]">
			<CardHeader>
				<CardTitle className="line-clamp-none font-semibold text-xl leading-none tracking-tight">
					Verification
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="rounded-md bg-vd-blue-100 p-3">
					<ShieldCheck size={32} className="stroke-current" />
					<div className="p-1" />
					<p className="font-medium text-sm text-vd-blue-700">
						This hypercerts and the work it represents have been verified.
					</p>
				</div>

				<ul>
					{verifiedData.map((detail) => (
						<li
							key={detail.title}
							className="border-b-[1.5px] border-b-vd-beige-200 py-4"
						>
							<p className="text-sm text-vd-blue-600">{detail.title}</p>
							{detail.value}
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
};

const ReportSidebar = ({
	metadata,
	hypercert_id,
}: { metadata: SidebarData; hypercert_id: string }) => {
	return (
		<aside className="flex flex-col gap-4">
			<ImpactDetails metadata={metadata} hypercert_id={hypercert_id} />
			<EvaluationDetails />
		</aside>
	);
};

export default ReportSidebar;
