import Link from "next/link";

import { NavLinks } from "@/components/global/nav-links";
import { WalletProfile } from "@/components/global/wallet-profile";

const NavMenu = () => {
  return (
    <nav className="py-5 border-b-[1.5px] border-b-vd-beige-300">
      <section className="container max-w-7xl flex justify-between items-center">
        <div className="flex flex-1 md:absolute md:top-4 md:left-[50%]">
          <Link className="w-full flex justify-center" href="/reports">
            <img className="size-10" src={"/logo.svg"} alt="VoiceDeck Logo" />
          </Link>
        </div>
        <NavLinks />

        <div className="flex gap-2">
          <WalletProfile />
        </div>
      </section>
    </nav>
  );
};

NavMenu.displayName = "NavMenu";

export { NavMenu };
