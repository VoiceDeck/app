import { NavLink, useFetcher } from "@remix-run/react";
import { cn } from "~/lib/utils";

// import { ConnectButton } from "../connect-button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { User } from "types/user";
import { useDisconnect } from "wagmi";
import { NavLinks } from "~/components/global/nav-links";
import { buttonVariants } from "~/components/ui/button";
import logo from "/logo.svg";
import { AccountButton } from "../account-button";

export interface NavProps {
	user: User | null;
}

const NavMenu = ({ user }: NavProps) => {
	const fetcher = useFetcher();
	const { disconnect } = useDisconnect();

	async function handleSignout() {
		disconnect();
		fetcher.submit({}, { method: "post", action: "/actions/auth/logout" });
	}

	return (
		<nav className="py-5 border-b-[1.5px] border-b-vd-beige-300">
			<section className="container max-w-7xl flex justify-between items-center">
				<div className="flex flex-1 md:absolute md:top-4 md:left-[50%]">
					<NavLink className="w-full flex justify-center" to="/reports">
						<img className="size-10" src={logo} alt="VoiceDeck Logo" />
					</NavLink>
				</div>
				<NavLinks />

				<div className="flex gap-2">
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
					<AccountButton handleSignOut={handleSignout} user={user} size="lg" />

					{/* <ConnectButton
						accountStatus={{
							smallScreen: "avatar",
							largeScreen: "full",
						}}
					/> */}
				</div>
			</section>
		</nav>
	);
};

NavMenu.displayName = "NavMenu";

export { NavMenu };
