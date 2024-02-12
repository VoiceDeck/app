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

interface HistoryCardProps {
	date: Date;
	amount: number;
	img: {
		src: string;
		alt: string;
	};
	title: string;
	category: string;
	location: string;
	description: string;
}

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
			<div className="flex justify-between px-6 pt-6 items-center">
				<time className="text-sm text-vd-blue-400" dateTime={formatDate(date)}>
					{formatDate(date)}
				</time>
				<data className="mt-0">{formatCurrency(amount)}</data>
			</div>
			<CardHeader className="md:flex-row">
				<img
					src={img.src}
					alt={img.alt}
					className="w-30 h-auto overflow-clip object-cover object-center rounded-3xl"
				/>
				<div className="pt-6">
					<CardTitle>{title}</CardTitle>
					{/* TODO: Refactor to use DynamicCategoryIcon component from Beyonder */}
					<div className="flex gap-2 py-4">
						<Badge variant="default" className="rounded-3xl justify-between">
							<Salad className="text-vd-orange-400 stroke-1 size-4 mr-1" />
							<p className="font-light text-xs">{category}</p>
						</Badge>
						{/* TODO: Refactor to use DynamicCategoryIcon component from Beyonder */}
						<Badge variant="default" className="rounded-3xl justify-between">
							<MapPin className="text-vd-orange-400 stroke-1 size-4 mr-1" />
							<p className="font-light text-xs">{location}</p>
						</Badge>
					</div>
					<Separator />
					<CardDescription className="pt-4">{description}</CardDescription>
				</div>
			</CardHeader>
		</Card>
	);
};

HistoryCard.displayName = "HistoryCard";

export { HistoryCard };
