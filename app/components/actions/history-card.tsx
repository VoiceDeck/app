import { MapPin, Salad } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { formatCurrency, formatDate } from "~/lib/utils";
import DynamicCategoryIcon from "../ui/dynamic-category-icon";
import { HistoryData } from "./history";

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
		<Card className="rounded-3xl bg-vd-beige-100">
			<CardHeader className="md:pb-2">
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
					<img
						src={img.src}
						alt={img.alt}
						className="w-30 md:w-auto h-full md:h-auto overflow-clip object-cover object-center rounded-3xl mb-2"
					/>
					<div className="flex flex-col gap-3">
						<CardTitle>{title}</CardTitle>
						{/* TODO: Refactor to use DynamicCategoryIcon component from Beyonder */}
						<div className="flex gap-2 pt-2">
							<Badge
								variant="default"
								className="rounded-3xl justify-between items-center"
							>
								<DynamicCategoryIcon category={category} />
								{/* <Salad className="text-vd-orange-400 stroke-1 size-4 mr-1" /> */}
								<p className="font-light text-xs ml-1">{category}</p>
							</Badge>
							{/* TODO: Refactor to use DynamicCategoryIcon component from Beyonder */}
							<Badge
								variant="default"
								className="rounded-3xl justify-between items-center"
							>
								<DynamicCategoryIcon category="Location" />
								{/* <MapPin className="text-vd-orange-400 stroke-1 size-4 mr-1" /> */}
								<p className="font-light text-xs ml-1">{location}</p>
							</Badge>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<Separator />
				<CardDescription className="pt-4">{description}</CardDescription>
			</CardContent>
		</Card>
	);
};

HistoryCard.displayName = "HistoryCard";

export { HistoryCard };
