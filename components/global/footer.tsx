"use client";
import { ArrowUpRight, Menu, Newspaper, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { externalLinks } from "@/config/site";
import { cn } from "@/lib/utils";
import { WalletProfile } from "./wallet-profile";

const Footer = () => {
	return (
		<footer className="fixed inset-x-0 bottom-0 items-center border-vd-beige-400 border-t-[1.5px] bg-vd-beige-100 py-2 text-center md:static">
			<MobileFooter />
			<DesktopFooter />
		</footer>
	);
};

const MobileFooter = () => {
	return (
		<nav
			aria-label="Mobile Footer Navigation"
			className="w-full px-8 pt-2 pb-4"
		>
			<ul className="flex items-center justify-between gap-1 md:hidden">
				<li>
					<Link
						href="/"
						className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
						passHref
					>
						<div className="jusify-center flex flex-col items-center">
							<Newspaper aria-hidden="true" focusable="false" />
							<span className="text-xs">Hypercerts</span>
						</div>
					</Link>
				</li>
				<li>
					<WalletProfile alignment="center" />
				</li>
				<li>
					<Drawer>
						<DrawerTrigger>
							<div className="flex flex-col items-center justify-center">
								<Menu aria-hidden="true" focusable="false" />
								<span className="text-xs">More</span>
							</div>
						</DrawerTrigger>

						<DrawerContent>
							<DrawerHeader>
								<div className="flex justify-center">
									<Image
										className="h-6 w-auto md:h-8 md:w-auto"
										src="/Hypercerts-logo-horisontal.svg"
										alt="Hypercerts Logo"
										width={250}
										height={100}
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
									<ArrowUpRight
										size={16}
										aria-hidden="true"
										focusable="false"
									/>
								</a>
							))}

							<DrawerFooter>
								<DrawerClose>
									<div className="flex w-full flex-col items-center justify-center">
										<X aria-hidden="true" focusable="false" />
										<span className="text-xs">Close</span>
									</div>
								</DrawerClose>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
				</li>
			</ul>
		</nav>
	);
};

const DesktopFooter = () => {
	return (
		<div className="hidden h-32 items-center justify-between md:container md:flex">
			<div className="flex flex-col">
				<Link href={"/reports"} passHref className="flex items-center gap-2">
					<Image
						className="h-6 w-auto md:h-8 md:w-auto"
						src="/Hypercerts-logo-horisontal.svg"
						alt="Hypercerts Logo"
						width={250}
						height={100}
					/>
				</Link>
				<p className="pt-2 font-medium text-base">Fund and reward impact</p>
			</div>
			<ul className="flex space-x-2">
				{externalLinks.map(({ url, title }) => (
					<li key={title}>
						<a
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							className={cn(
								buttonVariants({ variant: "link" }),
								"group flex items-center justify-between text-lg",
							)}
							aria-label={`Open ${title} in a new tab`}
						>
							{title}
							<span className="sr-only">(opens in a new tab)</span>
							<ArrowUpRight
								size={18}
								className="group-hover:-translate-y-0.5 ml-1 opacity-70 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 group-hover:opacity-100"
								aria-hidden="true"
							/>
						</a>
					</li>
				))}
			</ul>
		</div>
	);
};

export { Footer };
