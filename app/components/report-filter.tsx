import { Circle, Filter } from "lucide-react";
import { useMemo } from "react";
import DynamicCategoryIcon from "~/components/dynamic-category-icon";
import { Button } from "~/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerTrigger,
} from "~/components/ui/drawer";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import type { Report } from "~/types";

interface ReportFilterProps {
	reports: Report[];
	amounts: number[];
}

const ReportFilter: React.FC<ReportFilterProps> = ({ reports, amounts }) => {
	const uniqueCategories = useMemo(() => {
		return reports
			.map((report: Report, index: number) => report.category)
			.filter(
				(value: string, index: number, self: string[]) =>
					self.indexOf(value) === index,
			);
	}, [reports]);

	// here using amounts directly from the HC, needs additional logic to group those amounts into displayed ranges ie $0-50, $50-100
	const uniqueFundedAmounts = useMemo(() => {
		return amounts.filter(
			(value: number, index: number, self: number[]) =>
				self.indexOf(value) === index,
		);
	}, [amounts]);

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
		<article className="w-full max-w-screen-xl">
			<h2 className="text-3xl md:text-4xl font-semibold pt-6 md:pt-10">
				Reports
			</h2>
			<div className="flex flex-col md:flex-row md:justify-between md:items-end pb-8">
				<p className="text-base pb-4 md:pb-0 ">
					Find and fund reports that resonate with you.
				</p>
				<div className="flex flex-col md:flex-row gap-3">
					<Input
						className="h-10 border-vd-blue-500 bg-vd-beige-100 py-2 text-base font-medium placeholder:text-vd-blue-500 ring-offset-white focus-visible:ring-offset-2 focus-visible:ring-vd-blue-500 focus-visible:ring-2"
						type="search"
						placeholder="Search Reports"
					/>
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

			<div className="flex flex-col md:flex-row gap-10 pb-16">
				<section>
					<div className="md:hidden">
						<Drawer>
							<DrawerTrigger className="flex h-9 w-full rounded-md border-input justify-between items-center bg-vd-blue-100 border border-vd-blue-500 px-3 py-2">
								<p className="text-base font-medium text-vd-blue-500">Filter</p>
								<Filter color="#3A5264" size={18} />
							</DrawerTrigger>
							<DrawerContent className="gap-10">
								<DrawerFooter>
									<DrawerClose>
										<Button variant="ghost" size="icon">
											<div className="flex flex-col justify-center items-center">
												<span className="text-xs">Close</span>
											</div>
										</Button>
									</DrawerClose>
								</DrawerFooter>
							</DrawerContent>
						</Drawer>
					</div>
					<div className="border border-b-vd-blue-400 py-4">
						<h2 className="text-base font-medium pb-4">Categories</h2>
						{uniqueCategories.map((category: string) => (
							<div key={category} className="flex items-center gap-2 pb-1">
								<DynamicCategoryIcon category={category} />
								<p className="text-sm">{category}</p>
							</div>
						))}
					</div>
					<div className="border border-b-vd-blue-400 pt-6 pb-4">
						<h2 className="text-base font-medium pb-4">Amount needed</h2>

						{uniqueFundedAmounts.map((amount: number) => (
							<div key={amount} className="flex items-center gap-2 pb-1">
								<Circle size={18} strokeWidth={1} />
								<p className="text-xs">{amount}</p>
							</div>
						))}
					</div>
					<div className="border border-b-vd-blue-400 pt-6 pb-4">
						<h2 className="text-base font-medium pb-4">Story from</h2>
						{uniqueMediaOutlets.map((outlet: string) => (
							<div key={outlet} className="flex items-center gap-2 pb-1">
								<Circle size={18} strokeWidth={1} />
								<p className="text-xs">{outlet}</p>
							</div>
						))}
					</div>
					<div className="border border-b-vd-blue-400 pt-6 pb-4">
						<h2 className="text-base font-medium pb-4">State</h2>
						{uniqueStates.map((state: string) => (
							<div key={state} className="flex items-center gap-2 pb-1">
								<Circle size={18} strokeWidth={1} />
								<p className="text-xs">{state}</p>
							</div>
						))}
					</div>
					<div className="flex flex-col gap-5 pt-8 pb-4">
						<Button>Apply</Button>
						<Button variant={"outline"}>Clear all</Button>
					</div>
				</section>
			</div>
		</article>
	);
};

export default ReportFilter;
