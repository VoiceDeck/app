import { UserInfo } from "@/components/settings/user-info";
import { VerifiedCitizen } from "@/components/settings/verified-citizen";

export default function SettingsPage({
	params: { address },
}: {
	params: { address: `0x${string}` };
}) {
	return (
		<main className="container mx-auto flex flex-col gap-4 text-vd-blue-900 mb-6 max-w-3xl pb-16 md:pb-0">
			<header className="md:col-span-3 flex justify-between pt-4">
				<h1 className="text-3xl md:text-4xl font-semibold">Settings</h1>
			</header>
			<UserInfo />
			<VerifiedCitizen />
		</main>
	);
}
