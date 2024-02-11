import { NavLink } from "@remix-run/react";
import { Settings2 } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

function Actions() {
	return (
		<main className="container flex flex-col gap-4">
			{/* Start Actions Header */}
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
			{/* End Actions Header */}
			{/* Start My Actions */}
			<section className="flex flex-col gap-2">
				{/* TODO: Change to Cards? */}
				{/* <VoicedeckStats
          heading="My Contribution"
          data="520.00"
          currency="USD"
        /> */}
				{/* <VoicedeckStats
          heading="# of reports I contributed"
          data="12"
          color="secondary"
        /> */}
				<Card className="bg-vd-blue-200">
					<CardHeader>
						<CardDescription>My Contribution</CardDescription>
					</CardHeader>
					<CardContent>520.00 USD</CardContent>
				</Card>
				<Card className="bg-vd-beige-300">
					<CardHeader>
						<CardDescription>Become a Local Advocate</CardDescription>
					</CardHeader>
					<CardContent>12</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Issues I care about</CardTitle>
						<CardDescription>
							You have 3 actions that you have contributed to.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p>badge1</p>
						<p>badge2</p>
						<p>badge3</p>
						<p>badge4</p>
					</CardContent>
				</Card>
				{/* TODO: add issues I care about */}
			</section>
			{/* End My Actions */}
			{/* Start Action Matters Section */}
			<section className="flex flex-col gap-4">
				<Card>
					<CardHeader>
						<CardTitle className="text-center">Your Action Matters</CardTitle>
						<CardDescription className="text-center">
							There are 21 action reports that haven't completed their funding
							requests yet!
						</CardDescription>
					</CardHeader>
					<CardContent>
						<NavLink
							to="/actions/record"
							className={cn(buttonVariants({ variant: "default", size: "lg" }))}
						>
							Explore
						</NavLink>
					</CardContent>
				</Card>
				<Card className="bg-vd-beige-300">
					<CardHeader>
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
			{/* End Action Matters Section */}
			{/* Start History */}
			<section>
				<h2 className="text-xl font-semibold text-center md:text-left">
					Supporting History
				</h2>
			</section>
			{/* End History */}
		</main>
	);
}

export default Actions;
