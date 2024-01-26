import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-3xl text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-stone-950 dark:focus-visible:ring-stone-300",
	{
		variants: {
			variant: {
				default:
					"bg-vd-blue-900 text-vd-beige-100 hover:bg-vd-blue-900/90 dark:bg-vd-beige-100 dark:text-vd-blue-900 dark:hover:bg-vd-beige-100/90",
				destructive:
					"bg-red-500 text-vd-beige-100 hover:bg-red-500/90 dark:bg-red-900 dark:text-vd-beige-100 dark:hover:bg-red-900/90",
				outline:
					"border border-vd-blue-900 bg-transparent hover:bg-vd-beige-300 hover:text-vd-blue-900 dark:border-vd-beige-100 dark:bg-transparent dark:hover:bg-vd-beige-100 dark:hover:text-vd-beige-100",
				secondary:
					"bg-vd-gray-300 text-vd-blue-900 hover:bg-vd-gray-300/80 dark:bg-vd-beige-100 dark:text-vd-beige-100 dark:hover:bg-vd-beige-100/80",
				ghost:
					"hover:bg-vd-beige-300 hover:text-vd-blue-900 dark:hover:bg-vd-beige-100 dark:hover:text-vd-beige-100",
				link: "text-vd-blue-900 underline-offset-4 hover:underline dark:text-vd-beige-100",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
