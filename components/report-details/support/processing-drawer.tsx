import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Drawer } from "vaul";

interface SupportProcessingDrawerProps {
	container: HTMLDivElement | null;
}

export default function SupportProcessingDrawer({
	container,
}: SupportProcessingDrawerProps) {
	return (
		<Drawer.Root dismissible={false}>
			<Drawer.Trigger asChild>
				<Button size={"lg"} variant={"default"} type="submit">
					Support this contribution
				</Button>
			</Drawer.Trigger>
			<Drawer.Portal container={container}>
				<Drawer.Overlay className="fixed inset-0 bg-stone-900/60" />
				<Drawer.Content className="fixed right-0 bottom-0 left-0 flex max-h-[50%] flex-col rounded-t-xl bg-stone-100 after:hidden">
					<div className="flex flex-col gap-4 px-4 py-6">
						<div className="flex animate-spin justify-center">
							<Loader2 />
						</div>
						<div className="flex flex-col gap-4">
							<h4 className="text-center font-bold">Processing your support</h4>
							<p className="text-center">
								Please wait while we process your support. This may take a few
								seconds.
							</p>
						</div>
					</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	);
}
