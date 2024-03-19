"use client";
import { cn } from "@/lib/utils";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { buttonVariants } from "../ui/button";

export const NavLink = ({
	href,
	children,
	isActive,
	className,
}: {
	href: string;
	children: ReactNode;
	isActive: boolean;
	className?: string;
}) => {
	return (
		<Link
			href={href}
			className={cn(
				buttonVariants({ variant: "ghost" }),
				"rounded-md font-semibold",
				isActive ?? "bg-vd-beige-300 dark:bg-vd-beige-100",
				className || "",
			)}
		>
			{children}
		</Link>
	);
};

const NavLinks = () => {
	const pathname = usePathname();
	const isActive = (path: string) => pathname.startsWith(path);

	return (
		<ul className="hidden md:flex gap-1">
			<li>
				<NavLink href="/" isActive={isActive("/reports")}>
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
