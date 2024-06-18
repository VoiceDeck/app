import React from "react";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export interface CreateFractionalOfferFormValues {
	fractionId: string;
	// minUnitAmount: string;
	// maxUnitAmount: string;
	// minUnitsToKeep: string;
	// price: string;
	// sellLeftoverFraction: boolean;
}

// TODO: Move to modal component
const SellFractionsFormSchema = z.object({
	fractionsToSellFrom: z
		.string({
			required_error: "Fractions to sell from is required",
		})
		.email(),
	pricePerUnit: z.string({
		required_error: "You must set a price per unit",
	}),
	minimumUnitsPerSale: z.string({
		required_error: "You must set a minimum price per unit",
	}),
	maximumUnitsPerSale: z.string({
		required_error: "You must set a maximum price per unit",
	}),
	minimumUnitsToKeep: z.string({
		required_error: "Please select an email to display",
	}),
	sellRemaining: z
		.boolean({
			required_error: "Please select an email to display",
		})
		.default(false),
});

const SellFractionsForm = () => {
	const form = useForm<z.infer<typeof SellFractionsFormSchema>>({
		resolver: zodResolver(SellFractionsFormSchema),
		defaultValues: {},
	});

	function onSubmit(values: z.infer<typeof SellFractionsFormSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="fractionsToSellFrom"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Fractions to sell from</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select fraction to sell from" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem key={"10% - 20%"} value={"10% - 20%"}>
										10% - 20%
									</SelectItem>
									<SelectItem key={"20% - 30%"} value={"20% - 30%"}>
										20% - 30%
									</SelectItem>
									<SelectItem key={"30% - 40%"} value={"30% - 40%"}>
										30% - 40%
									</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="pricePerUnit"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Price per unit</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="Enter amount"
									className="w-full rounded-md border border-vd-blue-400 px-4 py-2"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="minimumUnitsPerSale"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Minimum amount of units per sale</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="Enter amount"
									className="w-full rounded-md border border-vd-blue-400 px-4 py-2"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="maximumUnitsPerSale"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Maximum amount of units per sale</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="Enter amount"
									className="w-full rounded-md border border-vd-blue-400 px-4 py-2"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="minimumUnitsToKeep"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Maximum amount of units per sale</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="Enter amount"
									className="w-full rounded-md border border-vd-blue-400 px-4 py-2"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="sellRemaining"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<FormLabel className="text-base">Sell remaining</FormLabel>
								<FormDescription>
									If there are less then the minimum
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
									aria-readonly
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
};

export { SellFractionsForm };
