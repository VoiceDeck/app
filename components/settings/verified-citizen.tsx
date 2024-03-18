import { HelpCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VerifiedStatus } from "@/components/settings/verified-status";

const VerifiedCitizen = () => {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl md:text-2xl font-semibold md:py-2">
        Verified Citizen
      </h2>
      <Card className="bg-vd-blue-200 rounded-3xl flex-1 shadow-none border-none">
        <CardHeader>
          <CardTitle className={cn("flex gap-1 items-center pb-0")}>
            <HelpCircleIcon size={16} strokeWidth={2} />
            Why does this matter?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            We prioritize the authenticity of each report. Recognizing that
            local residents have the most accurate insights into matters
            affecting their own region, we want to give the power back to them.
            Using an advanced cryptographic developer tool known as Anon
            Aadhaar, we use Aadhaar’s QR code to verify an individual's
            citizenship without revealing any information about them. For
            further details, you can read more here.
          </p>
        </CardContent>
      </Card>
      <Separator />
      <VerifiedStatus />
    </section>
  );
};

VerifiedCitizen.displayName = "VerifiedCitizen";

export { VerifiedCitizen };
