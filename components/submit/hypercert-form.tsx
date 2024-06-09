"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn, isValidEthereumAddress } from "@/lib/utils";

import { HypercertCard } from "@/components/submit/hypercert-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
	type HypercertMetadata,
	formatHypercertData,
} from "@hypercerts-org/sdk";

const telegramHandleRegex = /^@([a-zA-Z0-9_]{4,31})$/;
const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const HypercertMintSchema = z.object({
	title: z
		.string()
		.min(1, { message: "Hypercert Name is required" })
		.max(50, { message: "Hypercert Name must be less than 50 characters" }),
	description: z
		.string()
		.min(10, {
			message: "Description is required and must be at least 10 characters",
		})
		.max(500, { message: "Description must be less than 500 characters" }),
	link: z.string().url({ message: "Link must be a valid URL" }),
	cardImage: z.string().url("Card image not generated"),
	logo: z.string().url({ message: "Logo Image must be a valid URL" }),
	banner: z
		.string()
		.url({ message: "Background Banner Image must be a valid URL" }),
	tags: z
		.string()
		.refine((val) => val.split(",").every((tag) => tag.trim() !== ""), {
			message:
				"Tags must must not be empty, Multiple tags must be separated by commas",
		}),
	projectDates: z
		.object(
			{
				from: z.date(),
				to: z.date(),
			},
			{
				required_error: "Please select a date range",
			},
		)
		.refine((data) => data.from <= data.to, {
			path: ["projectDates"],
			message: "From date must be before to date",
		}),
	contributors: z
		.string()
		.refine(
			(value) => {
				// Split the string by ', ' to get individual addresses
				const addresses = value.split(", ").map((addr) => addr.trim());

				// Check if each address matches the Ethereum address pattern
				return addresses.every((address) => isValidEthereumAddress(address));
			},
			{
				message:
					"Each value must be a valid Ethereum address separated by a comma and a space.",
			},
		)
		.transform((value) => value.split(",").map((addr) => addr.trim())),
	contact: z
		.string()
		.refine(
			(value) =>
				telegramHandleRegex.test(value) ||
				/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
			{
				message: "Input must be a valid Telegram handle or email address",
			},
		),
	acceptTerms: z.boolean(),
	confirmContributorsPermission: z.boolean(),
});

type MintingFormValues = z.infer<typeof HypercertMintSchema>;

const HypercertForm = () => {
	const form = useForm<MintingFormValues>({
		resolver: zodResolver(HypercertMintSchema),
		defaultValues: {
			title: "",
			banner:
				"https://images.lemonade.social/eyJidWNrZXQiOiJsZW1vbmFkZS11cGxvYWRzLWV1LWNlbnRyYWwtMSIsImtleSI6IjY2MDQ4MDM0NzdjNzgzZjBmYmQ1ZDBlMS9ldmVudC82NjI0NGRlZjE1MTFhYjFlOTExYmQ1NzQucG5nIiwiZWRpdHMiOnsicmVzaXplIjp7ImhlaWdodCI6NTQwLCJmaXQiOiJjb3ZlciJ9fX0=",
			description: "",
			logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk8OYV3qda3Xf6p_wHHCh4uEDiKOLiB0652A&s",
			link: "",
			tags: "",
			projectDates: {
				from: new Date("2024-06-02"),
				to: new Date("2024-06-30"),
			},
			contact: "",
			acceptTerms: false,
			confirmContributorsPermission: false,
		},
		mode: "onChange",
	});

	const [badges, setBadges] = useState(["Edge Esmeralda", "Edge City"]);

	const tags = form.watch("tags") || "";

	useEffect(() => {
		if (tags) {
			const tagArray = tags
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag !== "");
			setBadges(["Edge Esmeralda", "Edge City", ...tagArray]);
		} else {
			setBadges(["Edge Esmeralda", "Edge City"]);
		}
	}, [tags]);

	const onSubmit = (values: MintingFormValues) => {
		console.log("Submit");
		const metadata: HypercertMetadata = {
			name: values.title,
			description: values.description,
			image: values.cardImage,
			external_url: values.link,
		};

		const formattedMetadata = formatHypercertData({
			...metadata,
			version: "2.0",
			properties: [],
			impactScope: ["all"],
			excludedImpactScope: [],
			workScope: badges,
			excludedWorkScope: [],
			rights: ["Public Display"],
			excludedRights: [],
			workTimeframeStart: values.projectDates.from.getTime() / 1000,
			workTimeframeEnd: values.projectDates.to.getTime() / 1000,
			impactTimeframeStart: values.projectDates.from.getTime() / 1000,
			impactTimeframeEnd: values.projectDates.to.getTime() / 1000,
			contributors: values.contributors,
		});
		console.log({ formattedMetadata });
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex gap-4">
					<Card className="rounded-3xl border-none bg-vd-beige-100 py-4 shadow-none">
						<CardContent className="flex flex-col gap-4">
							<h2 className="text-2xl">General Fields</h2>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Hypercert Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Edge Esmeralda Hypercert"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="logo"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Logo Image</FormLabel>
										<FormControl>
											<Input
												placeholder="https://i.imgur.com/hypercert-logo.png"
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="banner"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Background Banner Image</FormLabel>
										<FormControl>
											<Input
												placeholder="https://i.imgur.com/hypercert-banner.png"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												className="bg-inherit"
												placeholder="Hypercert description"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="link"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Link</FormLabel>
										<FormControl>
											<Input placeholder="https://hypercerts.org" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Separator />
							<h2 className="text-2xl">Hypercert Fields</h2>
							<FormField
								control={form.control}
								name="tags"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Work Scope</FormLabel>
										<FormControl>
											<Textarea
												className="bg-inherit"
												placeholder="Hypercerts, Impact, ..."
												{...field}
											/>
										</FormControl>
										<FormMessage />
										<div className="flex flex-wrap gap-0.5">
											{badges.map((tag) => (
												<Badge key={tag} variant="secondary">
													{tag}
												</Badge>
											))}
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="projectDates"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel>Project start and end date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-full rounded-sm border-input pl-3 text-left font-normal",
															!field.value && "text-muted-foreground",
														)}
													>
														{field.value.from ? (
															field.value.to ? (
																<>
																	{format(field.value.from, "LLL dd, y")}{" "}
																	&mdash; {format(field.value.to, "LLL dd, y")}
																</>
															) : (
																format(field.value.from, "LLL dd, y")
															)
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="range"
													selected={{
														// biome-ignore lint/style/noNonNullAssertion: <explanation>
														from: field.value.from!,
														to: field.value.to,
													}}
													defaultMonth={field.value.from}
													onSelect={(selectedDates) => {
														field.onChange(selectedDates);
														field.onBlur();
													}}
													disabled={(date) => date < new Date("1900-01-01")}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormDescription>
											The start and end date of the work considered in the
											hypercert
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="contributors"
								render={({ field }) => (
									<FormItem>
										<FormLabel>List of Contributors to the Work</FormLabel>
										<FormControl>
											<Textarea
												className="bg-inherit"
												placeholder="0xWalletAddress1, 0xWalletAddress2, ..."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Separator />
							<h2 className="text-2xl">Contact Information</h2>
							<FormField
								control={form.control}
								name="contact"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Telegram / Email</FormLabel>
										<FormControl>
											<Input placeholder="@Hypercerts" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmContributorsPermission"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>
												I confirm that all listed contributors gave their
												permission to include their work in this hypercert.
											</FormLabel>
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="acceptTerms"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>
												I agree to the{" "}
												<a
													href="https://hypercerts.org/terms/"
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-600"
												>
													Terms & Conditions
												</a>
											</FormLabel>
										</div>
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								className="flex w-full gap-2 rounded-md py-6"
							>
								Submit
							</Button>
						</CardContent>
					</Card>
					<HypercertCard
						title={form.getValues().title || undefined}
						description={form.getValues().description || undefined}
						banner={form.getValues().banner || undefined}
						logo={form.getValues().logo || undefined}
						displayOnly={true}
					/>
				</div>
			</form>
		</Form>
	);
};

export { HypercertForm };
