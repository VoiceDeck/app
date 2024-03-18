"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";

import { useDisconnect } from "wagmi";

const VerifiedStatus = () => {
	const { disconnect } = useDisconnect();
	return (
		<>
			<div className="flex justify-between">
				<p>
					Status: <span>Not yet verified.</span>
				</p>
				<Button className="md:min-w-48">Verify Now</Button>
			</div>
			<Separator />
			<div className="flex md:block">
				<Button
					className="md:min-w-40"
					size="lg"
					variant="outline"
					onClick={() => disconnect()}
				>
					Log out
				</Button>
			</div>
		</>
	);
};

VerifiedStatus.displayName = "VerifiedStatus";

export { VerifiedStatus };
