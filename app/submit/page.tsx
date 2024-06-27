import { SideBar } from "@/components/profile/sidebar";
import { HypercertForm } from "@/components/submit/hypercert-form";
import { Card, CardContent } from "@/components/ui/card";

function SubmitPage() {
	return (
		<main className="container flex max-w-4xl flex-col gap-4 pb-[64px] md:pb-12">
			{/* <main className="container grid max-w-screen-lg auto-rows-auto grid-cols-1 flex-col gap-4 p-4 pb-24 text-vd-blue-900 md:grid-cols-3 md:px-6 md:py-8"> */}
			{/* <section className="flex flex-col items-center p-4 md:p-8 gap-4"> */}
			<header className="flex w-3/4 flex-col gap-2 py-4">
				<h1 className="font-semibold text-xl md:text-3xl">
					Submit your contribution as a Hypercert
				</h1>
				<p className="text-sm">
					Please note: All information will be publicly available and can not be
					changed afterwards.
				</p>
			</header>
			<section>
				<HypercertForm />
			</section>
		</main>
	);
}

export default SubmitPage;
