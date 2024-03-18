"use client";
import {
	ArrowUpRight,
	HeartHandshake,
	Menu,
	Newspaper,
	Sparkles,
	X,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { externalLinks } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAccount } from "wagmi";

const Footer = () => {
	return (
		<footer className="fixed inset-x-0 bottom-0 bg-vd-beige-200 text-center items-center py-2 md:static">
			<MobileFooter />
			<DesktopFooter />
		</footer>
	);
};

const MobileFooter = () => {
	const { address } = useAccount();
	return (
		<ul className="flex justify-around items-center gap-1 md:hidden">
			<li>
				<Link
					href="/"
					className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
				>
					<div className="flex flex-col justify-center items-center">
						<Newspaper />
						<span className="text-xs">Reports</span>
					</div>
				</Link>
			</li>
			<li>
				<Link
					href={`/profile/${address}`}
					className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
				>
					<div className="flex flex-col justify-center items-center">
						<HeartHandshake />
						<span className="text-xs">My Actions</span>
					</div>
				</Link>
			</li>
			<li>
				<Drawer>
					<DrawerTrigger>
						<div className="flex flex-col justify-center items-center">
							<Menu />
							<span className="text-xs">More</span>
						</div>
					</DrawerTrigger>

					<DrawerContent>
						<DrawerHeader>
							<div className="flex justify-center">
								<img
									className="h-10 w-10"
									src={"/logo.svg"}
									alt="VoiceDeck Logo"
								/>
							</div>
						</DrawerHeader>
						{externalLinks.map((link) => (
							<a
								href={link.url}
								key={link.title}
								target="_blank"
								rel="noopener noreferrer"
								className={cn(
									buttonVariants({ variant: "link" }),
									"justify-between py-6",
								)}
							>
								{link.title}
								<ArrowUpRight size={16} />
							</a>
						))}

						<DrawerFooter>
							<DrawerClose>
								<Button variant="ghost" size="icon">
									<div className="flex flex-col justify-center items-center">
										<X />
										<span className="text-xs">Close</span>
									</div>
								</Button>
							</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			</li>
		</ul>
	);
};

const DesktopFooter = () => {
	return (
		<div className="hidden md:flex md:container h-32 items-center justify-between">
			<div className="flex flex-col">
				<div className="flex items-center">
					<img className="h-10 w-10" src={"/logo.svg"} alt="VoiceDeck Logo" />
					<h3 className="text-5xl font-semibold">VoiceDeck</h3>
				</div>
				<div className="flex gap-2">
					<small className="text-base">
						Funding platform for collective impact
					</small>
					<div className="self-center">
						<Sparkles color="#973A30" size={18} />
					</div>
					<small className="text-base">An open source project</small>
				</div>
				{/* <small className="text-base">
					An Open Source project. A funding platform for the collective impact.
				</small> */}
			</div>
			<ul>
				{externalLinks.map((link) => (
					<a
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						key={link.title}
						className={cn(
							buttonVariants({ variant: "link" }),
							"text-lg justify-between",
						)}
					>
						{link.title}
						<ArrowUpRight size={24} />
					</a>
				))}
			</ul>
		</div>
	);
};

export { Footer };
