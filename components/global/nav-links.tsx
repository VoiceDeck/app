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
		<ul className="hidden md:flex gap-1">
			<li>
				<NavLink href="/reports" isActive={isActive("/reports")}>
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
					href="https://voicedeck.org/faq/"
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						buttonVariants({ variant: "link" }),
						"font-semibold group",
					)}
				>
					<span>FAQs</span>
					<ArrowUpRight
						size={18}
						className="ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-transform duration-300 ease-in-out"
						aria-hidden="true"
					/>
				</a>
			</li>
		</ul>
	);
};

NavLinks.displayName = "NavLinks";

export { NavLinks };
