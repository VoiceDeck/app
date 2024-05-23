"use client";

import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

// TODO: Remove as this is not used
// const AnonAadhaarCard = () => {
// 	const [anonAadhaar] = useAnonAadhaar();

// 	return (
// 		<Card className="bg-vd-beige-100 rounded-3xl shadow-none border-none">
// 			<CardHeader>
// 				<img
// 					src="/teapot.svg"
// 					alt="teapot that looks like a building"
// 					className="mx-auto px-6 w-40 h-auto my-4"
// 				/>
// 				<CardTitle className="text-center text-lg md:text-xl">
// 					{anonAadhaar.status === "logged-in"
// 						? "You're a local advocate!"
// 						: "Log in to become a local advocate"}
// 				</CardTitle>
// 				<CardDescription className="text-center text-base">
// 					{anonAadhaar.status === "logged-in"
// 						? "Verified citizens can evaluate impacts and vote on VoiceDeck, shaping their community's future."
// 						: "Verify with Aadhaar to access community impact evaluation and voting on VoiceDeck."}
// 				</CardDescription>
// 			</CardHeader>
// 			<CardContent>
// 				<div className="flex flex-col gap-2 w-full px-2">
// 					<div className="flex flex-col gap-1 justify-center items-center w-full">
// 						<LogInWithAnonAadhaar nullifierSeed={893772993} />
// 					</div>
// 					<a
// 						href="https://voicedeck.org/faq#anonaadhaar"
// 						target="_blank"
// 						rel="noopener noreferrer"
// 						className={`${buttonVariants({
// 							variant: "link",
// 						})} font-semibold group`}
// 					>
// 						<span>Learn more</span>
// 						<ArrowUpRight
// 							size={18}
// 							className="ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-transform duration-300 ease-in-out"
// 							aria-hidden="true"
// 						/>
// 					</a>
// 				</div>
// 			</CardContent>
// 		</Card>
// 	);
// };

const SideBar = () => {
	return (
		<section className="flex flex-col gap-4 md:col-span-1 md:row-span-2">
			<Card className="rounded-3xl bg-vd-beige-100 shadow-none border-none">
				<CardHeader>
					<img
						src="/water.svg"
						alt="water in a crystal ball"
						className="mx-auto px-6 w-40 h-auto my-2"
					/>
					<CardTitle className="text-center text-lg md:text-xl">
						Your actions matter
					</CardTitle>
					<CardDescription className="text-center md:text-base">
						Exciting news! Numerous impactful projects are still on their
						journey to reach their funding targets!
					</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-center">
					<Link
						href="/reports"
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
