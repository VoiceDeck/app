"use client";
import Image from "next/image";
import Link from "next/link";

import { NavLinks } from "@/components/global/nav-links";
import { WalletProfile } from "@/components/global/wallet-profile";

const NavMenu = () => {
	return (
		<nav className="py-5 border-b-[1.5px] border-b-vd-beige-300">
			<section className="container max-w-7xl flex justify-between items-center">
				<div className="flex flex-1 md:absolute md:left-[50%] items-center py-5">
					<Link
						className="w-full flex justify-center"
						aria-label="ZuDeck Home"
						href="/reports"
					>
						<Image
							className="h-8 w-auto"
							src="/Hypercerts-logo-horisontal.svg"
							alt="VoiceDeck Logo"
							width={250}
							height={100}
						/>
					</Link>
				</div>
				<NavLinks />

				<div className="hidden md:flex gap-2">
					<WalletProfile />
				</div>
			</section>
		</nav>
	);
};

NavMenu.displayName = "NavMenu";

export { NavMenu };
