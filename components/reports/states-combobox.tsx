"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type ComboboxOption = {
	value: string;
	label: string;
};

export type ComboboxProps = {
	states: ComboboxOption[];
	selectedStates: string[];
	handleStateSelection: (state: string) => void;
};

const StateCombobox = ({
	states,
	handleStateSelection,
	selectedStates,
}: ComboboxProps) => {
	const [open, setOpen] = useState(false);

	const PopupTriggerContent = () => {
		return selectedStates.length > 0 ? (
			<div className="flex justify-between w-full py-1 gap-1">
				<div className="flex flex-wrap gap-1">
					{selectedStates.map((item, index) => (
						<Badge
							variant="outline"
							className="border-2"
							key={item}
							onClick={() => handleStateSelection(item)}
							aria-label={`Remove ${item}`}
						>
							{item}
							<X className="h-4 w-4" />
						</Badge>
					))}
				</div>
				<button
					type="button"
					onClick={() => handleStateSelection("remove-all")}
					className="p-0.5 rounded-full hover:bg-vd-beige-400"
					aria-label="Remove selected items"
				>
					<X className="h-4 w-4 shrink-0" />
				</button>
			</div>
		) : (
			<div className="w-full flex justify-between items-center">
				<p>Choose states</p>
				<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
			</div>
		);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-80 rounded-md bg-vd-beige-100 hover:bg-vd-beige-100"
				>
					<PopupTriggerContent />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 self-start p-0">
				<Command>
					<CommandList>
						<CommandInput placeholder="Search states..." />
						<CommandEmpty>No state found.</CommandEmpty>
						<CommandGroup>
							{states.map((state) => (
								<CommandItem
									key={state.value}
									value={state.value}
									onSelect={() => handleStateSelection(state.value)}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											selectedStates?.includes(state.value)
												? "opacity-100"
												: "opacity-0",
										)}
									/>
									{state.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export { StateCombobox };
