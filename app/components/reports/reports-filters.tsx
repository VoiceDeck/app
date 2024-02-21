import { Circle, Filter } from "lucide-react";
import { Button } from "~/components/ui/button";
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
	return (
		<div>
			<div className="flex flex-col lg:flex-row lg:justify-around lg:px-[18%] lg:py-12">
				<div className="border border-b-vd-blue-400 pt-4 md:pt-6 pb-2 md:pb-4">
					<h2 className="text-base font-medium pb-2 md:pb-4">Story from</h2>
					{outlets.map((outlet: string) => (
						<div key={outlet} className="flex items-center gap-2 pb-1">
							<Circle size={18} strokeWidth={1} />
							<p className="text-xs">{outlet}</p>
						</div>
					))}
				</div>
				<div className="border border-b-vd-blue-400 pt-4 md:pt-6 pb-2 md:pb-4">
					<h2 className="text-base font-medium pb-2 md:pb-4">State</h2>
					{states.map((state: string) => (
						<div key={state} className="flex items-center gap-2 pb-1">
							<Circle size={18} strokeWidth={1} />
							<p className="text-xs">{state}</p>
						</div>
					))}
				</div>
			</div>
			<Slider
				className="p-10"
				defaultValue={[330, 660]}
				min={Math.min(...amounts)}
				max={Math.max(...amounts)}
				step={10}
				minStepsBetweenThumbs={10}
			/>
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
						<p className="text-base font-medium text-vd-blue-500">Filter</p>
						<Filter color="#3A5264" size={18} />
					</DrawerTrigger>
					<DrawerContent className="">
						<FilterItems outlets={outlets} states={states} amounts={amounts} />
						<Button variant={"outline"}>Clear all</Button>
						<DrawerFooter>
							<DrawerClose>
								<Button>Apply</Button>
							</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			</div>
			<div className="hidden md:flex">
				<Dialog>
					<DialogTrigger className="flex gap-3 h-10 w-full rounded-md border-input justify-between items-center bg-vd-beige-100 border border-vd-blue-500 px-3 py-2">
						<p className="text-base font-medium text-vd-blue-500">Filter</p>
						<Filter color="#3A5264" size={18} />
					</DialogTrigger>
					<DialogContent>
						<FilterItems outlets={outlets} states={states} amounts={amounts} />
						<Button variant={"outline"}>Clear all</Button>
						<DialogFooter className="sm:justify-start">
							<DialogClose asChild>
								<Button>Apply</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};

export default ReportsFilters;
