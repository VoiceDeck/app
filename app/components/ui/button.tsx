import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-colors transition-transform duration-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vd-blue-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-stone-950 dark:focus-visible:ring-stone-300",
	{
		variants: {
			variant: {
				default:
					"rounded-3xl bg-vd-blue-900 text-vd-beige-100 hover:bg-vd-blue-700 dark:bg-vd-beige-100 dark:text-vd-blue-900 dark:hover:bg-vd-beige-100/90 active:outline-none active:scale-95 active:ring-2 active:ring-vd-blue-400 active:ring-offset-2",
				destructive:
					"rounded-3xl bg-red-500 text-vd-beige-100 hover:bg-red-500/90 dark:bg-red-900 dark:text-vd-beige-100 dark:hover:bg-red-900/90",
				outline:
					"rounded-3xl border border-vd-blue-900 bg-transparent hover:bg-vd-beige-300 hover:text-vd-blue-900 dark:border-vd-beige-100 dark:bg-transparent dark:hover:bg-vd-beige-100 dark:hover:text-vd-beige-100",
				secondary:
					"rounded-3xl bg-vd-gray-300 text-vd-blue-900 hover:bg-vd-gray-300/80 dark:bg-vd-beige-100 dark:text-vd-beige-100 dark:hover:bg-vd-beige-100/80",
				ghost:
					"rounded-3xl text-vd-blue-700 hover:bg-vd-beige-300 hover:text-vd-blue-900 dark:hover:bg-vd-beige-100 dark:hover:text-vd-beige-100",
				link: "text-vd-blue-700 hover:underline underline-offset-4 dark:text-vd-beige-100 hover:text-vd-blue-900 dark:hover:text-vd-beige-100",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-3xl px-3",
				lg: "h-11 rounded-3xl px-8",
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
