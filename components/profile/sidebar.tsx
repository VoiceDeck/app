"use client";

import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { HeartPulse } from "lucide-react";
import Link from "next/link";

const SideBar = () => {
	return (
		<section className="flex flex-col gap-4 md:col-span-1 md:row-span-2">
			<Card className="rounded-3xl shadow-none">
				<CardHeader>
					<div className="mx-auto my-2 h-auto w-40 px-6">
						<HeartPulse className="h-28 w-28" />
					</div>
					<CardTitle className="text-center text-lg md:text-xl">
						Your support matters
					</CardTitle>
					<CardDescription className="text-center md:text-base">
						There are more impactful contributions that you can support!
					</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-center">
					<Link
						href="/"
						className={buttonVariants({ variant: "default", size: "lg" })}
					>
						Explore
					</Link>
				</CardContent>
			</Card>
		</section>
	);
};

SideBar.displayName = "SideBar";

export { SideBar };
