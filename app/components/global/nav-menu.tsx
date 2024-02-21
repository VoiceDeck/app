import { NavLink } from "@remix-run/react";
import { cn } from "~/lib/utils";

import { NavLinks } from "~/components/global/nav-links";
import { buttonVariants } from "~/components/ui/button";
import logo from "/logo.svg";

const NavMenu = () => {
	return (
		<nav className="py-5 border-b-[1.5px] border-b-vd-beige-300">
			<section className="container max-w-7xl flex justify-between items-center">
				<div className="flex flex-1 md:absolute md:top-4 md:left-[50%]">
					<NavLink className="w-full flex justify-center" to="/reports">
						<img className="size-10" src={logo} alt="VoiceDeck Logo" />
					</NavLink>
				</div>
				<NavLinks />

				<NavLink
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
				</NavLink>
			</section>
		</nav>
	);
};

NavMenu.displayName = "NavMenu";

export { NavMenu };
