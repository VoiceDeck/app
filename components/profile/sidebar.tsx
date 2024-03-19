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
						Your Action Matters
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
						Become a Local Advocate
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
						{/* info copy can be added when anon aadhaar is implemented */}
						{/* <Link
							href="/my-actions/record"
							className={cn(
								buttonVariants({ variant: "ghost", size: "lg" }),
								"w-full",
							)}
						>
							Learn more
						</Link> */}
					</div>
				</CardContent>
			</Card>
		</section>
	);
};

SideBar.displayName = "SideBar";

export { SideBar };
