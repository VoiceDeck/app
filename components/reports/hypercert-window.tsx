import { Separator } from "@/components/ui/separator";
import { type SupportedChainIdType, supportedChains } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export type HypercertMiniDisplayProps = {
	hypercertId: string;
	name: string;
	chainId: SupportedChainIdType;
	fromDateDisplay?: string | null;
	toDateDisplay?: string | null;
	attestations: {
		data:
			| {
					data: unknown;
			  }[]
			| null;
		count: number | null;
	} | null;
	hasTrustedEvaluator?: boolean;
	percentAvailable?: number;
	lowestPrice?: string;
};

const HypercertWindow = ({
	hasTrustedEvaluator,
	percentAvailable,
	lowestPrice,
	hypercertId,
	name,
	chainId,
	attestations,
}: HypercertMiniDisplayProps) => {
	const cardChain = (chainId: SupportedChainIdType) => {
		return supportedChains.find((x) => x.id === chainId)?.name;
	};

	return (
		<Link href={`/hypercerts/${hypercertId}`}>
			<article className="hover:-translate-y-2 group relative overflow-hidden rounded-md transition-transform duration-300">
				<div className="h-[320px] min-w-[300px] max-w-[350px]">
					<div className="relative h-full w-full overflow-hidden bg-black">
						<Image
							src={`/api/hypercerts/${hypercertId}/image`}
							alt={name || "Untitled"}
							fill
							className="object-contain object-center p-4"
						/>
					</div>
				</div>
				<section className="absolute top-4 left-4 flex space-x-1 opacity-100 transition-opacity duration-150 ease-out group-hover:opacity-100 md:opacity-0">
					<div className="rounded-md border border-white/60 bg-black px-2 py-0.5 text-white text-xs">
						{cardChain(chainId)}
					</div>
					<div className="rounded-md border border-white/60 bg-black px-2 py-0.5 text-white text-xs">
						{/* // ! This is rendered based on Evaluation Status in hypercerts-app. Because the explore hypercerts page only renders approved hypercerts hard-coded for now. */}
						approved
					</div>
				</section>
				<section className="absolute bottom-0 w-full space-y-2 bg-black/70 p-4 text-white backdrop-blur-sm">
					<p
						className={`line-clamp-2 flex-1 text-ellipsis font-medium text-sm${
							name ? "text-white" : "text-slate-100"
						}`}
					>
						{name || "[Untitled]"}
					</p>
					<Separator className="my-2 border-white opacity-40" />
					<section className="flex justify-between text-xs">
						<section>
							<h6 className="opacity-70">for sale</h6>
							<p> {percentAvailable ? `${percentAvailable}%` : "--"}</p>
						</section>
						<section>
							<h6 className="text-end opacity-70">lowest per %</h6>
							<p className="font-medium">
								{lowestPrice ? lowestPrice : "--"} ETH
							</p>
						</section>
					</section>
				</section>
			</article>
		</Link>
	);
};

export default HypercertWindow;
