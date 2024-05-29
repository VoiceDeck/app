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
		<main className="p-4 md:p-8 md:max-w-screen-xl mx-auto flex flex-col gap-4 text-vd-blue-900 mb-6 max-w-3xl pb-16 md:pb-0">
			<header className="md:col-span-3 pt-4">
				<Link
					href={`/profile/${address}`}
					className="group flex space-x-1 items-center"
				>
					<ChevronLeft
						size={24}
						className="text-vd-blue-400 group-hover:-translate-x-2 transition-transform duration-300 ease-in-out"
					/>
					<p className="font-semibold text-sm uppercase text-vd-blue-500 tracking-wider">
						Profile
					</p>
				</Link>
				<div className="p-2" />
				<h1 className="text-3xl md:text-4xl font-semibold">Settings</h1>
			</header>
			<UserInfo />
			{/* <VerifiedCitizen /> */}
		</main>
	);
}
