import { NavLink } from "@remix-run/react";
import { Settings2 } from "lucide-react";

import { cn } from "~/lib/utils";

import { History } from "~/components/actions/history";
import { Summary } from "~/components/actions/summary";
import { buttonVariants } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

function Actions() {
	return (
		<main className="container flex flex-col gap-4 text-vd-blue-900 mb-6">
			<header className="flex justify-between my-4">
				<h1 className="text-2xl md:text-5xl font-semibold">My Actions</h1>
				<NavLink
					to="/actions"
					className={cn(buttonVariants({ variant: "link" }))}
				>
					Settings
					<Settings2 className="ml-2 h-4 w-4 mt-1" />
				</NavLink>
			</header>
			<Summary />
			<section className="flex flex-col gap-4">
				<Card className="rounded-3xl">
					<CardHeader>
						<img
							src="/water.svg"
							alt="water in a crystal ball"
							className="mx-auto px-6 w-40 h-auto my-2"
						/>
						<CardTitle className="text-center">Your Action Matters</CardTitle>
						<CardDescription className="text-center">
							There are 21 action reports that haven't completed their funding
							requests yet!
						</CardDescription>
					</CardHeader>
					<CardContent className="flex justify-center">
						<NavLink
							to="/actions/record"
							className={cn(buttonVariants({ variant: "default", size: "lg" }))}
						>
							Explore
						</NavLink>
					</CardContent>
				</Card>
				<Card className="bg-vd-beige-300 rounded-3xl">
					<CardHeader>
						<img
							src="/teapot.svg"
							alt="teapot that looks like a building"
							className="mx-auto px-6 w-40 h-auto my-4"
						/>
						<CardTitle className="text-center">
							Become a Local Advocate
						</CardTitle>
						<CardDescription className="text-center">
							Cares about your community? By verifying your Indian citizenship,
							you will be able access feature like evaluation, voting features
							on the platform.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-2 w-full px-2">
							<NavLink
								to="/actions/record"
								className={cn(
									buttonVariants({ variant: "default", size: "lg" }),
									"w-full",
								)}
							>
								Verify now
							</NavLink>
							<NavLink
								to="/actions/record"
								className={cn(
									buttonVariants({ variant: "ghost", size: "lg" }),
									"w-full",
								)}
							>
								Learn more
							</NavLink>
						</div>
					</CardContent>
				</Card>
			</section>
			<History />
		</main>
	);
}

export default Actions;
