"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAccount } from "wagmi";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { iconComponents } from "@/components/ui/dynamic-category-icon";
import { cn } from "@/lib/utils";

const Summary = ({
	totalAmount,
	reportCount,
	categoryCounts,
}: {
	totalAmount: number;
	reportCount: number;
	categoryCounts: { [key: string]: number };
}) => {
	const { isConnected } = useAccount();
	const router = useRouter();
	useEffect(() => {
		if (!isConnected) {
			// If not connected, redirect to /reports
			router.push("/reports");
		}
	}, [isConnected, router]);

	return (
		<section className="flex flex-col gap-4 md:col-span-2">
			<div className="flex flex-col gap-4 md:flex-row">
				<Card
					className={cn(
						"flex-1 rounded-3xl border-none bg-vd-blue-200 shadow-none",
					)}
				>
					<CardHeader>
						<CardTitle className={cn("font-normal text-sm")}>
							My Support
						</CardTitle>
					</CardHeader>
					<CardContent>
						<data className="font-bold text-4xl">{totalAmount} USD</data>
					</CardContent>
				</Card>
				<Card
					className={cn(
						"rounded-3xl border-none bg-vd-beige-300 shadow-none md:flex-1",
					)}
				>
					<CardHeader>
						<CardTitle className={cn("font-normal text-sm")}>
							# of Hypercerts I own
						</CardTitle>
					</CardHeader>
					<CardContent>
						<data className="font-bold text-4xl">{reportCount}</data>
					</CardContent>
				</Card>
			</div>
			<Card
				className={cn("rounded-3xl border-none bg-vd-beige-100 shadow-none")}
			>
				<CardHeader>
					<CardTitle className={cn("font-normal text-sm")}>
						Categories of my Hypercerts:
					</CardTitle>
				</CardHeader>
				<CardContent>
					{/* TODO: Populate data dynamically based on user */}
					<div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
						{Object.entries(iconComponents).map(([icon, Icon]) => {
							// Skip rendering the "Location" icon
							if (icon === "Location") {
								return null;
							}

							// Get the count for the icon, defaulting to 0 if not present in categoryCounts
							const count = categoryCounts[icon] || 0;

							return (
								<Badge
									key={icon}
									variant="secondary"
									className="w-full justify-between rounded-3xl px-5 py-3"
								>
									<div className="flex items-center gap-1">
										<Icon className="size-4 stroke-[1.5] text-vd-orange-400" />
										<p className="font-normal text-vd-blue-900">{icon}</p>
									</div>
									<data>{count}</data>
								</Badge>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</section>
	);
};

Summary.displayName = "Summary";

export { Summary };
