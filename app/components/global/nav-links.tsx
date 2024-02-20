import { NavLink } from "@remix-run/react";
import { cn } from "~/lib/utils";

import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "../ui/button";

const NavLinks = () => {
	return (
		<ul className="hidden md:flex gap-1">
			<li>
				<NavLink
					to="/"
					className={({ isActive }) =>
						cn(
							buttonVariants({ variant: "ghost" }),
							"rounded-md font-semibold",
							isActive ?? "bg-vd-beige-300 dark:bg-vd-beige-100",
						)
					}
				>
					Reports
				</NavLink>
			</li>
			<li>
				<a
					href="http://about-example.com"
					target="_blank"
					rel="noopener noreferrer"
					className={cn(buttonVariants({ variant: "link" }), "font-semibold")}
				>
					About
					<div className="p-0.5" />
					<ArrowUpRight size={18} />
				</a>
				{/* TODO: I believe that About and FAQs are external Links. If they are different Routes use below. Confirm in Design Review */}
				{/* <NavLink
          to="/about"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: "link" }),
              "rounded-md",
              isActive ? "bg-vd-beige-300 dark:bg-vd-beige-100" : undefined,
            )
          }
        >
          {({ isActive }) =>
            isActive ? (
              "About"
            ) : (
              <>
                About <ArrowUpRight />
              </>
            )
          }
        </NavLink> */}
			</li>
			<li>
				<a
					href="http://faqs-example.com"
					target="_blank"
					rel="noopener noreferrer"
					className={cn(buttonVariants({ variant: "link" }), "font-semibold")}
				>
					FAQs
					<div className="p-0.5" />
					<ArrowUpRight size={18} />
				</a>
			</li>
		</ul>
	);
};

NavLinks.displayName = "NavLinks";

export { NavLinks };
