import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
		<Card className={cn("rounded-3xl border-none shadow-none")}>
			<CardHeader className={cn("md:pb-2")}>
				<div className="flex items-center justify-between pb-2">
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
							className="aspect-[3/2] h-auto w-full rounded-2xl object-cover md:max-h-32"
						/>
					</div>
					<div className="flex flex-col gap-3">
						<CardTitle>{title}</CardTitle>
						<div className="flex gap-2 pt-2">
							<Badge
								variant="secondary"
								className={cn("items-center justify-between rounded-3xl")}
							>
								<p className="ml-1 font-light text-xs">{category}</p>
							</Badge>
							<Badge
								variant="secondary"
								className={cn("items-center justify-between rounded-3xl")}
							>
								<p className="ml-1 font-light text-xs">{location}</p>
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
