"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAccount } from "wagmi";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { iconComponents } from "@/components/ui/dynamic-category-icon";

const Summary = () => {
  const { isConnected } = useAccount();
  const router = useRouter();
  useEffect(() => {
    if (!isConnected) {
      // If not connected, redirect to /reports
      router.push("/reports");
    }
  }, [isConnected, router]);

  return (
    <section className="flex flex-col gap-4 md:col-span-2">
      <div className="flex flex-col gap-4 md:flex-row">
        <Card
          className={cn(
            "bg-vd-blue-200 rounded-3xl flex-1 shadow-none border-none",
          )}
        >
          <CardHeader>
            <CardTitle className={cn("text-sm font-normal")}>
              My Contribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <data className="text-4xl font-bold">520.00 USD</data>
          </CardContent>
        </Card>
        <Card
          className={cn(
            "bg-vd-beige-300 rounded-3xl md:flex-1 shadow-none border-none",
          )}
        >
          <CardHeader>
            <CardTitle className={cn("text-sm font-normal")}>
              # of reports I contributed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <data className="text-4xl font-bold">12</data>
          </CardContent>
        </Card>
      </div>
      <Card
        className={cn("rounded-3xl bg-vd-beige-100 shadow-none border-none")}
      >
        <CardHeader>
          <CardTitle className={cn("text-sm font-normal")}>
            Issues I care about:
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Populate data dynamically based on user */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            {Object.entries(iconComponents).map(([icon, Icon]) => {
              // Don't render Map Icon for Location
              if (icon === "Location") {
                return;
              }
              return (
                <Badge
                  key={icon}
                  variant="secondary"
                  className={cn("rounded-3xl w-full justify-between px-5 py-3")}
                >
                  <div className="flex gap-1 items-center">
                    <Icon className="text-vd-orange-400 stroke-[1.5] size-4" />
                    <p className="font-normal text-vd-blue-900">{icon}</p>
                  </div>
                  <data>0</data>
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

Summary.displayName = "Summary";

export { Summary };
