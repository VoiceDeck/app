"use client";
import { cn } from "@/lib/utils";

import { useDisconnect } from "wagmi";
import { NavLink, NavLinks } from "@/components/global/nav-links";
import { buttonVariants } from "@/components/ui/button";
import ConnectButton from "../connect-button";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NavMenu = () => {
	return (
		<nav className="py-5 border-b-[1.5px] border-b-vd-beige-300">
			<section className="container max-w-7xl flex justify-between items-center">
				<div className="flex flex-1 md:absolute md:top-4 md:left-[50%]">
					<Link className="w-full flex justify-center" href="/reports">
						<img className="size-10" src={"/logo.svg"} alt="VoiceDeck Logo" />
					</Link>
				</div>
				<NavLinks />

				<div className="flex gap-2">
					{/* <NavLink
						to="/my-actions"
						className={({ isActive }) =>
							cn(
								buttonVariants({ variant: "ghost" }),
								"rounded-md hidden md:inline-flex font-medium",
								isActive ? "bg-vd-beige-300 dark:bg-vd-beige-100" : undefined,
							)
						}
					>
						My Actions
					</NavLink> */}
					{/* {user?.wallet ? (
						<AccountButton
							handleSignOut={handleSignout}
							user={user}
							size="lg"
						/>
					) : (
						<ConnectButton size="lg" user={user} />
					)} */}
					<ConnectButton />
				</div>
			</section>
		</nav>
	);
};

NavMenu.displayName = "NavMenu";

export { NavMenu };
