import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8">
			<h1 className="font-extrabold text-5xl">Oops!</h1>
			<Image src="/teapot.svg" alt="404" width={300} height={300} />
			<h2 className="text-4xl">Page Not Found</h2>
			<p className="text-xl">Giving it more time to blossom</p>
			<Link
				className={cn(
					buttonVariants({ variant: "default" }),
					"rounded-md font-semibold",
				)}
				href="/"
			>
				Return Home
			</Link>
		</section>
	);
}
