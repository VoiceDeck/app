import { NavLink } from "@remix-run/react";
import { Settings2 } from "lucide-react";

import { cn } from "~/lib/utils";

import { History } from "~/components/my-actions/history";
import { SideBar } from "~/components/my-actions/sidebar";
import { Summary } from "~/components/my-actions/summary";
import { buttonVariants } from "~/components/ui/button";

import historyImg from "/sample-history-img.jpeg";

const mockData = [
	{
		id: 1,
		date: new Date("2021-10-28"),
		amount: 45.0,
		img: {
			src: historyImg,
			alt: "sample history image",
		},
		title: "Construction of a Dobha in Giridih District",
		category: "Dignity",
		location: "Jammu and Kashmir",
		description:
			"lorem ipsum msg from the user after complete transaction, should just display max. 1 line here then editable on the report detail page.",
	},
	{
		id: 2,
		date: new Date("2021-06-18"),
		amount: 145.0,
		img: {
			src: historyImg,
			alt: "another sample history image",
		},
		title: "Construction of a well in Rishikesh",
		category: "Thirst",
		location: "Rishikesh",
		description:
			"lorem ipsum msg from the user after complete transaction, should just display max. 1 line here then editable on the report detail page.",
	},
];

function Actions() {
	return (
		<main className="container grid grid-cols-1 md:grid-cols-3 auto-rows-auto md:gap-4 gap-4 text-vd-blue-900 mb-6">
			<header className="md:col-span-3 flex justify-between my-4">
				<h1 className="text-xl md:text-3xl font-semibold">My Actions</h1>
				<NavLink
					to="/actions"
					className={cn(buttonVariants({ variant: "link" }))}
				>
					Settings
					<Settings2 className="ml-2 h-4 w-4 mt-1" />
				</NavLink>
			</header>
			<Summary />
			<SideBar />
			<History history={mockData} />
		</main>
	);
}

export default Actions;
