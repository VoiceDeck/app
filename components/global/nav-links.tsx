"use client";
import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

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
		<ul className="hidden gap-1 md:flex">
			<li>
				<NavLink href="/" isActive={isActive("/reports")}>
					Browse
				</NavLink>
			</li>
			<li>
				<NavLink href="/submit" isActive={isActive("/submit")}>
					Submit
				</NavLink>
			</li>
			<li>
				<a
					href="https://testnet.hypercerts.org/docs/intro"
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						buttonVariants({ variant: "link" }),
						"group font-semibold",
					)}
				>
					<span>FAQs</span>
					<ArrowUpRight
						size={18}
						className="group-hover:-translate-y-0.5 ml-1 opacity-70 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 group-hover:opacity-100"
						aria-hidden="true"
					/>
				</a>
			</li>
		</ul>
	);
};

NavLinks.displayName = "NavLinks";

export { NavLinks };
