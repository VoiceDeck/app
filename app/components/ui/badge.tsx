import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full border border-vd-orange-800 px-5 py-1.5 text-sm font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-vd-orange-800 focus:ring-offset-2 dark:vd-beige-100 dark:focus:ring-vd-beige-100",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-vd-beige-300 text-vd-orange-900 hover:bg-vd-beige-300/70 dark:bg-beige-300 dark:text-vd-orange-900 dark:hover:bg-beige-300/70",
				secondary:
					"border-transparent bg-vd-beige-100 text-vd-orange-900 hover:bg-vd-beige-100 dark:bg-vd-beige-100 dark:text-vd-orange-900 dark:hover:bg-vd-beige-100",
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
