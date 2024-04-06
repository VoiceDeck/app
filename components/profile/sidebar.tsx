"use client"

import { AnonAadhaarProvider, LogInWithAnonAadhaar, useAnonAadhaar, AnonAadhaarProof } from "@anon-aadhaar/react";
import { useEffect } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
					<CardTitle className="text-center text-lg md:text-xl">
						{anonAadhaar.status === "logged-in"
							? "You're a local advocate!"
							: "Log in to become a local advocate"}
					</CardTitle>
					<CardDescription className="text-center text-base">
						{anonAadhaar.status === "logged-in"
							? "Verified citizens can evaluate impacts and vote on VoiceDeck, shaping their community's future."
							: "Verify with Aadhaar to access community impact evaluation and voting on VoiceDeck."}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-2 w-full items-center">
            <AnonAadhaarProvider _useTestAadhaar={true}>
              {anonAadhaar?.status !== "logged-in" &&
                <LogInWithAnonAadhaar />
              }
              {anonAadhaar?.status === "logged-in" && (
                <>
                  <p>✅ Proof is valid</p>
                  <AnonAadhaarProof code={JSON.stringify(anonAadhaar.pcd, null, 2)} />
                  <p>thank you for verifying your identity with AnonAadhaar!</p>
                </>
              )}
            </AnonAadhaarProvider>
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
              <ArrowUpRight
                size={18}
                className="opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-transform duration-300 ease-in-out"
                aria-hidden="true"
              />
						</a>
					</div>
				</CardContent>
			</Card>

		</section>
	);
};

SideBar.displayName = "SideBar";

export { SideBar };
