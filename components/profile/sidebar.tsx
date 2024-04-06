"use client";

import { LogInWithAnonAadhaar, useAnonAadhaar } from "@anon-aadhaar/react";
import { useEffect } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SideBar = () => {
	const [anonAadhaar] = useAnonAadhaar();

	useEffect(() => {
		console.log("Anon Aadhaar status: ", anonAadhaar.status);
	}, [anonAadhaar]);

	return (
		<section className="flex flex-col gap-4 md:col-span-1 md:row-span-2">
			<Card
				className={cn("rounded-3xl bg-vd-beige-100 shadow-none border-none")}
			>
				<CardHeader>
					<img
						src="/water.svg"
						alt="water in a crystal ball"
						className="mx-auto px-6 w-40 h-auto my-2"
					/>
					<CardTitle className={cn("text-center")}>
						Your actions matter
					</CardTitle>
					<CardDescription className={cn("text-center")}>
						There are many more impact reports that haven't completed their
						funding requests yet!
					</CardDescription>
				</CardHeader>
				<CardContent className={cn("flex justify-center")}>
					<Link
						href="/reports"
						className={cn(buttonVariants({ variant: "default", size: "lg" }))}
					>
						Explore
					</Link>
				</CardContent>
			</Card>
			<Card
				className={cn("bg-vd-beige-300 rounded-3xl shadow-none border-none")}
			>
				<CardHeader>
					<img
						src="/teapot.svg"
						alt="teapot that looks like a building"
						className="mx-auto px-6 w-40 h-auto my-4"
					/>
					<CardTitle className={cn("text-center")}>
						Become a local advocate
					</CardTitle>
					<CardDescription className={cn("text-center")}>
						Care about your community? When you verify your identity with
						Aadhaar, you will be able to access impact evaluation and voting
						features on the VoiceDeck platform.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-2 w-full px-2">
						<Link
							href="/my-actions/record"
							className={cn(
								buttonVariants({ variant: "default", size: "lg" }),
								"w-full",
							)}
						>
							Verify now
						</Link>
						<a
							href="https://voicedeck.org/faq#anonaadhaar"
							target="_blank"
							rel="noopener noreferrer"
							className={cn(
								buttonVariants({ variant: "ghost", size: "lg" }),
								"w-full",
							)}
						>
							Learn more
						</a>
					</div>
				</CardContent>
			</Card>
			<div>
				<LogInWithAnonAadhaar nullifierSeed={0} />
				<p>{anonAadhaar?.status}</p>
			</div>
		</section>
	);
};

SideBar.displayName = "SideBar";

export { SideBar };
