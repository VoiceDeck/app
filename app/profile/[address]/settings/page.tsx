import { UserInfo } from "@/components/settings/user-info";
import { VerifiedCitizen } from "@/components/settings/verified-citizen";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage({
	params: { address },
}: {
	params: { address: `0x${string}` };
}) {
	return (
		<main className="mx-auto mb-6 flex max-w-3xl flex-col gap-4 p-4 pb-16 text-vd-blue-900 md:max-w-screen-xl md:p-8 md:pb-0">
			<header className="pt-4 md:col-span-3">
				<Link
					href={`/profile/${address}`}
					className="group flex items-center space-x-1"
				>
					<ChevronLeft
						size={24}
						className="group-hover:-translate-x-2 text-vd-blue-400 transition-transform duration-300 ease-in-out"
					/>
					<p className="font-semibold text-sm text-vd-blue-500 uppercase tracking-wider">
						Profile
					</p>
				</Link>
				<div className="p-2" />
				<h1 className="font-semibold text-3xl md:text-4xl">Settings</h1>
			</header>
			<UserInfo />
			{/* <VerifiedCitizen /> */}
		</main>
	);
}
