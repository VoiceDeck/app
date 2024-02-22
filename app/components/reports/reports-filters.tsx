import { Filter } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerTrigger,
} from "~/components/ui/drawer";
import { Separator } from "~/components/ui/separator";
import { Slider } from "~/components/ui/slider";

interface ReportFiltersProps {
	outlets: string[];
	states: string[];
	amounts: number[];
}

const FilterItems: React.FC<ReportFiltersProps> = ({
	outlets,
	states,
	amounts,
}) => {
	const minAmountNeeded = Math.min(...amounts);
	const maxAmountNeeded = Math.max(...amounts);
	const rangeBetweenAmounts = maxAmountNeeded - minAmountNeeded;
	return (
		<div className="p-6">
			<h2 className="pl-4 text-lg font-medium">Amount needed</h2>
			<div className="px-6 py-8">
				<Slider
					defaultValue={[
						Math.floor(rangeBetweenAmounts * 0.25),
						Math.floor(rangeBetweenAmounts * 0.75),
					]}
					min={minAmountNeeded}
					max={maxAmountNeeded}
					step={4}
					minStepsBetweenThumbs={18}
				/>
			</div>
			<Separator className="bg-vd-blue-500 my-6 md:my-10" />
			<div className="flex flex-col md:flex-row md:justify-between">
				<div className="pl-4">
					<h2 className="text-lg font-medium pb-2 md:pb-4">Story from</h2>
					{outlets.map((outlet: string) => (
						<div key={outlet} className="flex items-center gap-2 pb-2">
							<Checkbox className="h-6 w-6 rounded-full border-vd-blue-500 data-[state=checked]:bg-vd-blue-500 data-[state=checked]:text-vd-beige-100" />
							<p className="text-base">{outlet}</p>
						</div>
					))}
				</div>
				<Separator
					className="md:hidden bg-vd-blue-500 my-6"
					orientation="horizontal"
				/>
				<Separator
					className="hidden md:flex bg-vd-blue-500 mx-6"
					orientation="vertical"
				/>
				<div className="pl-4">
					<h2 className="text-lg font-medium pb-2 md:pb-4">State</h2>
					{states.map((state: string) => (
						<div key={state} className="flex items-center gap-2 pb-2">
							<Checkbox className="h-6 w-6 rounded-full border-vd-blue-500 data-[state=checked]:bg-vd-blue-500 data-[state=checked]:text-vd-beige-100" />
							<p className="text-base">{state}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

const ReportsFilters: React.FC<ReportFiltersProps> = ({
	outlets,
	states,
	amounts,
}) => {
	return (
		<div>
			<div className="md:hidden">
				<Drawer>
					<DrawerTrigger className="flex gap-3 h-10 w-full rounded-md border-input justify-between items-center bg-vd-beige-100 border border-vd-blue-500 px-3 py-2">
						<p className="text-sm font-medium text-vd-blue-500">Filter</p>
						<Filter color="#4B778F" size={18} />
					</DrawerTrigger>
					<DrawerContent className="">
						<FilterItems outlets={outlets} states={states} amounts={amounts} />
						<DrawerFooter className="flex-row justify-center gap-2 pb-8">
							<Button
								className="text-xs w-36 h-7"
								variant={"outline"}
								size={"sm"}
							>
								Clear all
							</Button>
							<DrawerClose>
								<Button className="text-xs w-36 h-7" size={"sm"}>
									Apply
								</Button>
							</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			</div>
			<div className="hidden md:flex">
				<Dialog>
					<DialogTrigger className="flex gap-3 h-10 w-full rounded-md border-input justify-between items-center bg-vd-beige-100 border border-vd-blue-500 px-3 py-2">
						<p className="text-sm font-medium text-vd-blue-500">Filter</p>
						<Filter color="#4B778F" size={18} />
					</DialogTrigger>
					<DialogContent className="bg-vd-beige-200">
						<FilterItems outlets={outlets} states={states} amounts={amounts} />
						<DialogFooter className="justify-end gap-2 pb-4">
							<Button
								className="text-xs w-36 h-7"
								variant={"outline"}
								size={"sm"}
							>
								Clear all
							</Button>
							<DialogClose asChild>
								<Button className="text-xs w-36 h-7" size={"sm"}>
									Apply
								</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};

export default ReportsFilters;
