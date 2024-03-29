import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DynamicCategoryIcon } from "@/components/ui/dynamic-category-icon";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { HistoryData } from "./history";

type HistoryCardProps = Omit<HistoryData, "id">;

const HistoryCard = ({
	date,
	amount,
	img,
	title,
	category,
	location,
	description,
}: HistoryCardProps) => {
	return (
		<Card className={cn("rounded-3xl bg-vd-beige-100 shadow-none border-none")}>
			<CardHeader className={cn("md:pb-2")}>
				<div className="flex justify-between pb-2 items-center">
					<time
						className="text-sm text-vd-blue-400"
						dateTime={formatDate(date)}
					>
						{formatDate(date)}
					</time>
					<data className="mt-0">{formatCurrency(amount)}</data>
				</div>
				<div className="flex flex-col gap-2 md:flex-row md:items-center">
					<div className="overflow-hidden">
						<img
							src={img.src}
							alt={img.alt}
							className="h-auto md:max-h-32 aspect-[3/2] w-full rounded-2xl object-cover"
						/>
					</div>
					<div className="flex flex-col gap-3">
						<CardTitle>{title}</CardTitle>
						<div className="flex gap-2 pt-2">
							<Badge
								variant="secondary"
								className={cn("rounded-3xl justify-between items-center")}
							>
								<DynamicCategoryIcon category={category} />
								<p className="font-light text-xs ml-1">{category}</p>
							</Badge>
							<Badge
								variant="secondary"
								className={cn("rounded-3xl justify-between items-center")}
							>
								<DynamicCategoryIcon category="Location" />
								<p className="font-light text-xs ml-1">{location}</p>
							</Badge>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<Separator />
				<CardDescription className={cn("pt-4")}>{description}</CardDescription>
			</CardContent>
		</Card>
	);
};

HistoryCard.displayName = "HistoryCard";

export { HistoryCard };
