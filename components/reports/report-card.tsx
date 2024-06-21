import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";

interface ReportCardProps {
	slug: string;
	hypercertId: string;
	image: string;
	title: string;
	summary: string;
	category?: string;
	state?: string;
	totalCost?: number;
	fundedSoFar?: number;
}

const ReportCard: React.FC<ReportCardProps> = ({
	slug,
	hypercertId,
	image,
	title,
	summary,
	category,
	state,
	totalCost,
	fundedSoFar,
}) => {
	console.log("hypercertId", hypercertId);
	return (
		<Link href={`/${slug}`} passHref>
			<Card
				key={hypercertId}
				// biome-ignore lint/nursery/useSortedClasses: ease-[cubic-bezier(0.76, 0, 0.24, 1)] gets sorted in the wrong way
				className="w-full h-full rounded-3xl bg-vd-beige-100 text-vd-blue-900 shadow-none transition-transform duration-300 ease-[cubic-bezier(0.76, 0, 0.24, 1)] md:w-[280px] sm:w-[250px] hover:scale-105 hover:shadow-md"
			>
				<CardHeader className="p-0">
					<div className="relative h-40 w-full overflow-hidden rounded-t-3xl">
						<Image
							className="bg-center object-cover"
							src={image}
							alt={title}
							sizes="(min-width: 780px) 278px, (min-width: 640px) 248px, (min-width: 420px) calc(100vw - 26px), calc(20vw + 294px)"
							fill
						/>
					</div>
					<section className="flex flex-col gap-1 px-5 py-2">
						<CardTitle className="line-clamp-2 font-bold text-lg leading-tight">
							{title}
						</CardTitle>
						<CardDescription className="line-clamp-2 text-xs tracking-normal">
							{summary}
						</CardDescription>
					</section>
				</CardHeader>
				<CardContent className="flex w-full gap-1 px-4 py-2">
					{/* <Badge
						variant="secondary"
						className="font-normal hover:bg-vd-beige-200 pointer-events-none"
					>
						<p>{category}</p>
					</Badge> */}
					{/* <Badge
						variant="secondary"
						className="*:font-normal hover:bg-vd-beige-200 pointer-events-none overflow-clip text-ellipsis"
						title={state}
					>
						<MapPin color="#C14E41" strokeWidth={1} size={18} />
						<p className="text-nowrap line-clamp-1">{state}</p>
					</Badge> */}
				</CardContent>
				<CardFooter className="flex-col justify-center gap-2 p-3">
					<p>placeholder for funding progress</p>
					{/* <Progress
						className="w-full"
						value={(fundedSoFar / totalCost) * 100}
					/>
					<p className="text-xs">
						{fundedSoFar === totalCost
							? "Funded!"
							: `${totalCost - fundedSoFar} needed`}
					</p> */}
				</CardFooter>
			</Card>
		</Link>
	);
};

export default ReportCard;
