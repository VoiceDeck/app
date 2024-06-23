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
	hypercert_id: string;
	image: string;
	name: string;
	description: string;
	work_scope?: string;
	state?: string;
	totalCost?: number;
	fundedSoFar?: number;
}

export interface Hypercert {
	hypercert_id: string;
	name: string;
	work_scope: string[];
	image: string;
	description: string;
	creator_address: string;
}

const ReportCard: React.FC<Hypercert> = ({
	hypercert_id,
	image,
	name,
	description,
	work_scope,
	creator_address,
}) => {
	const firstThreeBadges = work_scope.slice(0, 3);
	console.log("hypercert_id", hypercert_id);
	return (
		<Link href={`/${hypercert_id}`} passHref>
			<Card
				key={hypercert_id}
				// biome-ignore lint/nursery/useSortedClasses: ease-[cubic-bezier(0.76, 0, 0.24, 1)] gets sorted in the wrong way
				className="w-full h-full rounded-3xl bg-vd-beige-100 text-vd-blue-900 shadow-none transition-transform duration-300 ease-[cubic-bezier(0.76, 0, 0.24, 1)] md:w-[280px] sm:w-[250px] hover:scale-105 hover:shadow-md"
			>
				<CardHeader className="p-0">
					<div className="relative h-40 w-full overflow-hidden rounded-t-3xl">
						<Image
							className="bg-center object-cover"
							src={image}
							alt={name}
							sizes="(min-width: 780px) 278px, (min-width: 640px) 248px, (min-width: 420px) calc(100vw - 26px), calc(20vw + 294px)"
							fill
						/>
					</div>
					<section className="flex flex-col gap-1 px-5 py-2">
						<CardTitle className="line-clamp-2 font-bold text-lg leading-tight">
							{name}
						</CardTitle>
						<CardDescription className="line-clamp-2 text-xs tracking-normal">
							{description}
						</CardDescription>
					</section>
				</CardHeader>
				<CardContent className="flex w-full flex-wrap gap-1 px-4 py-2">
					{firstThreeBadges.map((badge) => (
						<Badge
							key={badge}
							variant="secondary"
							className="items-center justify-between rounded-3xl"
						>
							<p>{badge}</p>
						</Badge>
					))}
					{work_scope.length > 3 && (
						<Badge
							variant="secondary"
							className="items-center justify-between rounded-3xl"
						>
							<p>More...</p>
						</Badge>
					)}
				</CardContent>
				<CardFooter className="flex-col justify-center gap-2 p-3">
					{/* <p>placeholder for funding progress</p> */}
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
