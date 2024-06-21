"use client";

import React from "react";
import { SupportReport } from "../report-details/support/dialog";

function BuyFraction({
	hypercertId,
	image,
	name,
}: { hypercertId: string; image: string; name: string }) {
	// console.log("Orders Data:", data);
	return (
		<div>
			<SupportReport hypercertId={hypercertId} image={image} title={name} />
		</div>
	);
}

export default BuyFraction;
