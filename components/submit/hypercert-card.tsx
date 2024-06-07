import { Sparkle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";

export interface HypercertCardProps {
	title?: string;
	description?: string;
	banner?: string;
	logo?: string;
	displayOnly?: boolean;
	hypercertId?: string;
}

const defaultValues: HypercertCardProps = {
	title: "Your title here",
	description: "Your description here",
};

const HypercertCard = forwardRef<HTMLDivElement, HypercertCardProps>(
	(
		{
			title = defaultValues.title,
			description = defaultValues.description,
			banner,
			logo,
			hypercertId,
			displayOnly = false,
		}: HypercertCardProps,
		ref,
	) => {
		title = title ?? defaultValues.title;
		description = description ?? defaultValues.description;

		const CardContent = () => (
			<article
				ref={ref}
				className="relative h-[250px] w-full max-w-[280px] overflow-clip rounded-xl border-[1.5px] border-slate-500 bg-black"
			>
				<header className="relative flex h-[110px] w-full items-center justify-center overflow-clip rounded-b-xl">
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
				<section className="absolute top-[88px] left-3 overflow-hidden rounded-full border-4 border-white bg-slate-200">
					<div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-300">
						{logo ? (
							<Image src={logo} alt={`${title} logo`} fill unoptimized />
						) : (
							<div className="flex h-10 w-10 items-center justify-center bg-slate-300">
								<Sparkle size={24} />
							</div>
						)}
					</div>
				</section>
				<section className="h-full rounded-t-xl border-black border-t-[1.5px] bg-white px-3 pt-8 pb-3">
					<h5
						className="line-clamp-1 text-ellipsis font-medium text-lg text-slate-800 tracking-tight"
						title={title}
					>
						{title}
					</h5>
					<p className="line-clamp-3 overflow-ellipsis text-pretty text-slate-500 text-sm leading-tight tracking-normal">
						{description}
					</p>
				</section>
			</article>
		);
		return displayOnly ? (
			<CardContent />
		) : (
			<Link
				href={hypercertId ? `/hypercerts/${hypercertId}` : "#"}
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
