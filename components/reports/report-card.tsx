import { MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { DynamicCategoryIcon } from "../ui/dynamic-category-icon";
import { Progress } from "../ui/progress";

interface ReportCardProps {
	hypercertId: string;
	image: string;
	title: string;
	summary: string;
	category: string;
	state: string;
	totalCost: number;
	fundedSoFar: number;
}

const ReportCard: React.FC<ReportCardProps> = ({
	hypercertId,
	image,
	title,
	summary,
	category,
	state,
	totalCost,
	fundedSoFar,
}) => {
	return (
		<Card
			key={hypercertId}
			className="w-full rounded-3xl bg-vd-beige-100 text-vd-blue-900 hover:scale-105 ease-out transition-transform duration-150 hover:shadow-md"
		>
			<CardHeader className="p-0">
				<img
					src={image}
					alt={title}
					className="w-full h-44 overflow-clip object-cover object-center rounded-t-3xl"
				/>
				<section className="flex flex-col gap-1 px-5 py-2">
					<CardTitle className="text-lg font-bold leading-tight line-clamp-2">
						{title}
					</CardTitle>
					<CardDescription className="text-xs tracking-normal line-clamp-2">
						{summary}
					</CardDescription>
				</section>
			</CardHeader>
			<CardContent className="flex gap-2 px-5 py-2">
				<Badge variant="secondary" className="font-normal hover:bg-vd-beige-200 pointer-events-none">
					<DynamicCategoryIcon category={category} />
					<p>{category}</p>
				</Badge>
				<Badge variant="secondary" className="font-normal hover:bg-vd-beige-200 pointer-events-none">
					<MapPin color="#C14E41" strokeWidth={1} size={18} />
					<p>{state}</p>
				</Badge>
			</CardContent>
			<CardFooter className="flex-col justify-center gap-2 p-3">
				<Progress className="w-full" value={(fundedSoFar / totalCost) * 100} />
				{/* <p className="text-xs">${totalCost - fundedSoFar} still needed</p> */}
			</CardFooter>
		</Card>
	);
};

export default ReportCard;
