import { NavLink } from "@remix-run/react";
import { cn } from "~/lib/utils";

import { NavLinks } from "~/components/global/nav-links";
import { buttonVariants } from "~/components/ui/button";
import logo from "/logo.svg";

const NavMenu = () => {
	return (
		<nav className="container mx-auto relative flex h-12 md:h-24 justify-between items-center">
			<NavLinks />
			<NavLink className="absolute left-1/2 transform -translate-x-1/2" to="/">
				<img className="h-10 w-10" src={logo} alt="VoiceDeck Logo" />
			</NavLink>

			<NavLink
				to="/my-actions"
				className={({ isActive }) =>
					cn(
						buttonVariants({ variant: "ghost" }),
						"rounded-md text-lg hidden md:block",
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
