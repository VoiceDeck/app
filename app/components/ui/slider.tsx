import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { useState } from "react";

import { cn } from "~/lib/utils";

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
	const values = props.defaultValue || [0, 100];
	const [min, setMin] = useState(values[0]);
	const [max, setMax] = useState(values[1]);
	return (
		<SliderPrimitive.Root
			ref={ref}
			onValueChange={(e) => {
				setMin(e[0]);
				setMax(e[1]);
			}}
			className={cn(
				"relative flex w-full touch-none select-none items-center",
				className,
			)}
			{...props}
		>
			<SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-vd-blue-200 dark:bg-stone-800">
				<SliderPrimitive.Range className="absolute h-full bg-vd-blue-900 dark:bg-stone-50" />
			</SliderPrimitive.Track>
			<SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-vd-blue-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-stone-50 dark:bg-stone-950 dark:ring-offset-stone-950 dark:focus-visible:ring-stone-300">
				<p className="pt-5">{min}</p>
			</SliderPrimitive.Thumb>
			<SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-vd-blue-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-stone-50 dark:bg-stone-950 dark:ring-offset-stone-950 dark:focus-visible:ring-stone-300">
				<p className="pt-5">{max}</p>
			</SliderPrimitive.Thumb>
		</SliderPrimitive.Root>
	);
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
