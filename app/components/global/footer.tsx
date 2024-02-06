import { NavLink } from "@remix-run/react";
import { ArrowUpRight, HeartHandshake, Menu, Newspaper, X } from "lucide-react";

import { Button, buttonVariants } from "~/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "~/components/ui/drawer";
import { cn } from "~/lib/utils";

const Footer = () => {
	return (
		<footer className="fixed inset-x-0 bottom-0 bg-red-100 text-center items-center py-2">
			<ul className="flex justify-around items-center gap-1 md:hidden">
				<li>
					<NavLink
						to="/"
						className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
					>
						<div className="flex flex-col justify-center items-center">
							<Newspaper />
							<span className="text-xs">Reports</span>
						</div>
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/actions"
						className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
					>
						<div className="flex flex-col justify-center items-center">
							<HeartHandshake />
							<span className="text-xs">My Actions</span>
						</div>
					</NavLink>
				</li>
				<li>
					<Drawer>
						<DrawerTrigger>
							<div className="flex flex-col justify-center items-center">
								<Menu />
								<span className="text-xs">More</span>
							</div>
						</DrawerTrigger>
						<DrawerContent className=" gap-10">
							<DrawerHeader>
								<img
									className="h-10 w-10"
									src="/logo.svg"
									alt="VoiceDeck Logo"
								/>
							</DrawerHeader>
							<a
								href="http://about-example.com"
								target="_blank"
								rel="noopener noreferrer"
								className={cn(
									buttonVariants({ variant: "link" }),
									"text-lg justify-between",
								)}
							>
								About
								<ArrowUpRight size={24} />
							</a>
							<a
								href="http://about-example.com"
								target="_blank"
								rel="noopener noreferrer"
								className={cn(
									buttonVariants({ variant: "link" }),
									"text-lg justify-between",
								)}
							>
								FAQs <ArrowUpRight size={24} />
							</a>
							<a
								href="http://about-example.com"
								target="_blank"
								rel="noopener noreferrer"
								className={cn(
									buttonVariants({ variant: "link" }),
									"text-lg justify-between",
								)}
							>
								GitHub <ArrowUpRight size={24} />
							</a>
							<a
								href="http://about-example.com"
								target="_blank"
								rel="noopener noreferrer"
								className={cn(
									buttonVariants({ variant: "link" }),
									"text-lg justify-between",
								)}
							>
								X <ArrowUpRight size={24} />
							</a>
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
		</footer>
	);
};

export default Footer;
