"use client";
import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/Hypercerts.svg";
import { NavLinks } from "@/components/global/nav-links";
import { WalletProfile } from "@/components/global/wallet-profile";

const NavMenu = () => {
	return (
		<nav className="border-b-[1.5px] border-b-stone-300 py-2 md:py-5">
			<section className="container flex max-w-7xl items-center justify-between">
				<div className="flex flex-1 items-center py-5 md:absolute md:left-[50%]">
					<Link
						className="flex w-full justify-center"
						aria-label="ZuDeck Home"
						href="/reports"
					>
						<Logo
							className="h-8 w-auto"
							alt="Hypercerts Logo"
							width={250}
							height={250}
						/>
					</Link>
				</div>
				<NavLinks />

				<div className="hidden gap-2 md:flex">
					<WalletProfile />
				</div>
			</section>
		</nav>
	);
};

NavMenu.displayName = "NavMenu";

export { NavMenu };
