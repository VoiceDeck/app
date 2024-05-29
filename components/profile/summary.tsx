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
						"bg-vd-blue-200 rounded-3xl flex-1 shadow-none border-none",
					)}
				>
					<CardHeader>
						<CardTitle className={cn("text-sm font-normal")}>
							My Support
						</CardTitle>
					</CardHeader>
					<CardContent>
						<data className="text-4xl font-bold">{totalAmount} USD</data>
					</CardContent>
				</Card>
				<Card
					className={cn(
						"bg-vd-beige-300 rounded-3xl md:flex-1 shadow-none border-none",
					)}
				>
					<CardHeader>
						<CardTitle className={cn("text-sm font-normal")}>
							# of Hypercerts I own
						</CardTitle>
					</CardHeader>
					<CardContent>
						<data className="text-4xl font-bold">{reportCount}</data>
					</CardContent>
				</Card>
			</div>
			<Card
				className={cn("rounded-3xl bg-vd-beige-100 shadow-none border-none")}
			>
				<CardHeader>
					<CardTitle className={cn("text-sm font-normal")}>
						Categories of my Hypercerts:
					</CardTitle>
				</CardHeader>
				<CardContent>
					{/* TODO: Populate data dynamically based on user */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
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
									className="rounded-3xl w-full justify-between px-5 py-3"
								>
									<div className="flex gap-1 items-center">
										<Icon className="text-vd-orange-400 stroke-[1.5] size-4" />
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
