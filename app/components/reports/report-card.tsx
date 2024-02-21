import { MapPin } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { DynamicCategoryIcon } from "~/components/ui/dynamic-category-icon";
import { Progress } from "~/components/ui/progress";

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
			className="w-full rounded-3xl bg-vd-beige-100 text-vd-blue-900"
		>
			<img
				src={image}
				alt="gpt-generated report illustration"
				className="w-full h-56 overflow-clip object-cover object-center rounded-t-3xl"
			/>
			<CardHeader className="space-y-0.5 px-5 py-3">
				<CardTitle className="text-lg font-bold tracking-wide leading-5 line-clamp-2">
					{title}
				</CardTitle>
				<CardDescription className="text-xs tracking-normal line-clamp-2">
					{summary}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex justify-center gap-2 px-2 pb-3">
				<Badge className="gap-1 rounded-full px-2 py-1 text-[10px] font-normal">
					<DynamicCategoryIcon category={category} />
					<p>{category}</p>
				</Badge>
				<Badge className="gap-1 rounded-full px-2 py-1 text-[10px] font-normal">
					<MapPin color="#C14E41" strokeWidth={1} size={18} />
					<p>{state}</p>
				</Badge>
			</CardContent>
			<CardFooter className="flex-col justify-center gap-2 px-8 pb-4 pt-0">
				<Progress value={(fundedSoFar / totalCost) * 100} />
				<p className="text-xs">${totalCost - fundedSoFar} still needed</p>
			</CardFooter>
		</Card>
	);
};

export default ReportCard;
