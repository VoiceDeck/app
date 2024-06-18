import { Sparkle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";
import { Badge } from "../ui/badge";

/**
 * HypercertCard component
 * @param {string} name - The name of the hypercert
 * @param {string} description - The description of the hypercert
 * @param {string} banner - The banner image of the hypercert
 * @param {string} logo - The logo image of the hypercert
 * @param {string} link - The link of the hypercert
 * @param {boolean} displayOnly - Whether the card is just for display (non-interactive) or not
 * @param {string} hypercertId - The unique identifier for the hypercert
 */
export interface HypercertCardProps {
	title?: string;
	description?: string;
	badges?: string[];
	banner?: string;
	logo?: string;
	workStartDate?: Date;
	workEndDate?: Date;
	displayOnly?: boolean;
	hypercertId?: string;
}

const HypercertCard = forwardRef<HTMLDivElement, HypercertCardProps>(
	(
		{
			title = "Your title here",
			description = "Your description here",
			badges,
			banner,
			workStartDate,
			workEndDate,
			logo,
			hypercertId,
			displayOnly = false,
		}: HypercertCardProps,
		ref,
	) => {
		title = title ?? "Your title here";
		description = description ?? "Your description here";

		const CardContent = () => (
			<article
				ref={ref}
				className="relative h-[320px] w-[275px] overflow-clip rounded-xl border-[1.5px] border-slate-500 bg-black"
			>
				<header className="relative flex h-2/5 w-full items-center justify-center overflow-clip rounded-b-xl">
					{banner ? (
						<Image
							src={banner}
							alt={`${title} banner`}
							className="object-cover"
							fill
							unoptimized
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-slate-200">
							<span className="text-lg text-slate-500">Your banner here</span>
						</div>
					)}
				</header>
				<section className="absolute top-16 left-3 overflow-hidden rounded-full border-4 border-white bg-slate-200">
					<div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-slate-300">
						{logo ? (
							<Image src={logo} alt={`${title} logo`} fill unoptimized />
						) : (
							<div className="flex h-10 w-10 items-center justify-center bg-slate-300">
								<Sparkle size={24} />
							</div>
						)}
					</div>
				</section>
				<section className="flex h-3/5 flex-col justify-between rounded-t-xl border-black border-t-[1.5px] bg-white px-3 pt-3 pb-3">
					<div className="">
						{workStartDate && workEndDate && (
							<p className="text-start text-slate-600 text-xs">{`${workStartDate.toDateString()} - ${workEndDate.toDateString()}`}</p>
						)}
						<h5
							className="line-clamp-1 text-ellipsis pt-2 font-semibold text-base text-slate-800 tracking-tight"
							title={title}
						>
							{title}
						</h5>
						<p className="test-slate-800 text-xs">
							{description.length > 100
								? `${description.substring(0, 100)}...`
								: description}
						</p>
					</div>
					<div className="flex flex-wrap gap-0.5 overflow-hidden">
						{badges?.map((badge) => (
							<Badge key={badge} variant="secondary">
								{badge}
							</Badge>
						))}
					</div>
				</section>
			</article>
		);
		return displayOnly ? (
			<CardContent />
		) : (
			<Link
				href={hypercertId ? `/hypercert/${hypercertId}` : "#"}
				passHref
				className="hover:-translate-y-1 w-max transition-transform duration-200 ease-[cubic-bezier(.44,.95,.63,.96)]"
			>
				<CardContent />
			</Link>
		);
	},
);

HypercertCard.displayName = "HypercertCard";

export { HypercertCard };
