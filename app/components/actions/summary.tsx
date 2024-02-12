import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { iconComponents } from "~/routes/_index";

const Summary = () => {
	return (
		<section className="flex flex-col gap-4">
			<Card className="bg-vd-blue-200 rounded-3xl">
				<CardHeader>
					<CardTitle className="text-sm font-normal">My Contribution</CardTitle>
				</CardHeader>
				<CardContent>
					<data className="text-4xl font-bold">520.00 USD</data>
				</CardContent>
			</Card>
			<Card className="bg-vd-beige-300 rounded-3xl">
				<CardHeader>
					<CardTitle className="text-sm font-normal">
						# of reports I contributed
					</CardTitle>
				</CardHeader>
				<CardContent>
					<data className="text-4xl font-bold">12</data>
				</CardContent>
			</Card>
			<Card className="rounded-3xl">
				<CardHeader>
					<CardTitle className="text-sm font-normal">
						Issues I care about:
					</CardTitle>
				</CardHeader>
				<CardContent>
					{/* TODO: Make Dynamic based on user */}
					<div className="flex flex-col gap-2">
						{/* TODO: Refactor to use DynamicCategoryIcon component from Beyonder */}
						{Object.entries(iconComponents).map(([icon, Icon]) => (
							<Badge
								key={icon}
								variant="default"
								className="rounded-3xl w-full justify-between px-5 py-3"
							>
								<div className="flex gap-1 items-center">
									<Icon className="text-vd-orange-400 stroke-[1.5] size-4" />
									<p className="font-normal text-vd-blue-900">{icon}</p>
								</div>
								<data>0</data>
							</Badge>
						))}
					</div>
				</CardContent>
			</Card>
		</section>
	);
};

Summary.displayName = "Summary";

export { Summary };
