import { HelpCircleIcon } from "lucide-react";

import { VerifiedStatus } from "@/components/settings/verified-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const VerifiedCitizen = () => {
	return (
		<section className="flex flex-col gap-4 max-w-lg">
			<h2 className="text-xl md:text-2xl font-semibold md:py-2">
				Citizen Verification
			</h2>
			<Card className="bg-vd-blue-200 rounded-md flex-1 shadow-none border-none">
				<CardHeader>
					<CardTitle className={cn("flex gap-1 items-center pb-0")}>
						<HelpCircleIcon size={16} strokeWidth={2} />
						Why does this matter?
					</CardTitle>
				</CardHeader>
				<CardContent>
					Our focus is on report authenticity, empowering local residents with
					the most accurate regional insights. Through Anon Aadhaar, a
					sophisticated cryptographic tool, we verify citizenship using
					Aadhaar’s QR code, ensuring privacy. For more information, read here.
				</CardContent>
			</Card>
			<VerifiedStatus />
		</section>
	);
};

VerifiedCitizen.displayName = "VerifiedCitizen";

export { VerifiedCitizen };
