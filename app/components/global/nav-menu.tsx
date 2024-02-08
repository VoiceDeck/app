import { NavLink } from "@remix-run/react";
import { cn } from "~/lib/utils";

import { NavLinks } from "~/components/global/nav-links";
import { buttonVariants } from "~/components/ui/button";
import logo from "/logo.svg";

const NavMenu = () => {
	return (
		<nav className="flex justify-between items-center py-3">
			<NavLinks />
			<NavLink className="w-full flex justify-center" to="/">
				<img className="h-10 w-10" src={logo} alt="VoiceDeck Logo" />
			</NavLink>

			<NavLink
				to="/actions"
				className={({ isActive }) =>
					cn(
						buttonVariants({ variant: "ghost" }),
						"rounded-md hidden md:block",
						isActive ? "bg-vd-beige-300 dark:bg-vd-beige-100" : undefined,
					)
				}
			>
				My Actions
			</NavLink>
		</nav>
	);
};

NavMenu.displayName = "NavMenu";

export { NavMenu };
