import { Circle, Filter } from "lucide-react";
import { useMemo } from "react";
import { Button } from "~/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerTrigger,
} from "~/components/ui/drawer";
import { DynamicCategoryIcon } from "~/components/ui/dynamic-category-icon";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import type { Report } from "~/types";

interface ReportsHeaderProps {
	reports: Report[];
	amounts: number[];
}

const ReportFilter: React.FC<ReportsHeaderProps> = ({ reports, amounts }) => {
	console.log(amounts);
	const uniqueCategories = useMemo(() => {
		return reports
			.map((report: Report, index: number) => report.category)
			.filter(
				(value: string, index: number, self: string[]) =>
					self.indexOf(value) === index,
			);
	}, [reports]);

	const uniqueMediaOutlets = useMemo(() => {
		return reports
			.map((report: Report, index: number) => report.contributors[0])
			.filter(
				(value: string, index: number, self: string[]) =>
					self.indexOf(value) === index,
			);
	}, [reports]);

	const uniqueStates = useMemo(() => {
		return reports
			.map((report: Report, index: number) => report.state)
			.filter(
				(value: string, index: number, self: string[]) =>
					self.indexOf(value) === index,
			);
	}, [reports]);

	return (
		<div>
			<div className="flex flex-col lg:flex-row lg:justify-around lg:px-[18%] lg:py-12">
				<div className="border border-b-vd-blue-400 py-2 md:py-4">
					<h2 className="text-base font-medium pb-2 md:pb-4">Categories</h2>
					{uniqueCategories.map((category: string) => (
						<div key={category} className="flex items-center gap-2 pb-1">
							<DynamicCategoryIcon category={category} />
							<p className="text-sm">{category}</p>
						</div>
					))}
				</div>
				<div className="border border-b-vd-blue-400 pt-4 md:pt-6 pb-2 md:pb-4">
					<h2 className="text-base font-medium pb-2 md:pb-4">Story from</h2>
					{uniqueMediaOutlets.map((outlet: string) => (
						<div key={outlet} className="flex items-center gap-2 pb-1">
							<Circle size={18} strokeWidth={1} />
							<p className="text-xs">{outlet}</p>
						</div>
					))}
				</div>
				<div className="border border-b-vd-blue-400 pt-4 md:pt-6 pb-2 md:pb-4">
					<h2 className="text-base font-medium pb-2 md:pb-4">State</h2>
					{uniqueStates.map((state: string) => (
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

const ReportsHeader: React.FC<ReportsHeaderProps> = ({ reports, amounts }) => {
	return (
		<article className="w-full max-w-screen-xl">
			<div className="flex flex-col xl:flex-row xl:justify-between xl:items-end pb-4 md:pb-6">
				<div>
					<h2 className="text-3xl md:text-4xl font-semibold pb-1 pt-6 md:pt-10">
						Reports
					</h2>
					<p className="text-sm pb-4 xl:pb-0">
						Find and fund reports that resonate with you.
					</p>
				</div>
				<div className="grid grid-rows-1 md:grid-cols-5 gap-3">
					<Drawer>
						<DrawerTrigger className="flex h-10 w-full rounded-md border-input justify-between items-center bg-vd-blue-100 border border-vd-blue-500 px-3 py-2">
							<p className="text-base font-medium text-vd-blue-500">Filter</p>
							<Filter color="#3A5264" size={18} />
						</DrawerTrigger>
						<DrawerContent className="">
							<ReportFilter reports={reports} amounts={amounts} />
							<DrawerFooter>
								<DrawerClose className=" lg:py-10">
									<Button variant="ghost" size="icon">
										<div className="flex flex-col justify-center items-center">
											<span className="text-xs">Close</span>
										</div>
									</Button>
								</DrawerClose>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>

					<Input
						className="h-10 border-vd-blue-500 bg-vd-beige-100 py-2 text-base font-medium placeholder:text-vd-blue-500 ring-offset-white focus-visible:ring-offset-2 focus-visible:ring-vd-blue-500 focus-visible:ring-2"
						type="search"
						placeholder="Search Reports"
					/>

					<Button>Apply</Button>
					<Button variant={"outline"}>Clear all</Button>

					<Select>
						<SelectTrigger>
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="amount-needed">Amount Needed</SelectItem>
							<SelectItem value="newest-oldest">Newest to Oldest</SelectItem>
							<SelectItem value="oldest-newest">Oldest to Newest</SelectItem>
							<SelectItem value="most-contributors">
								Most Contributors
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</article>
	);
};

export default ReportsHeader;
