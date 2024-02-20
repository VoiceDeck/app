import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
	"inline-flex gap-1 items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-vd-beige-100 text-vd-orange-800 hover:bg-vd-beige-300/70 dark:bg-beige-300 dark:text-vd-orange-900 dark:hover:bg-beige-300/70",
				secondary:
					"border-transparent bg-vd-beige-100 text-vd-orange-700 hover:bg-vd-beige-100 dark:bg-vd-beige-100 dark:text-vd-orange-900 dark:hover:bg-vd-beige-100",
				destructive:
					"border-transparent bg-red-500 text-vd-beige-100 hover:bg-red-500/80 dark:bg-red-900 dark:text-vd-beige-100 dark:hover:bg-red-900/80",
				outline: "text-vd-orange-900 dark:text-vd-orange-900",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };
