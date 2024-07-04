"use client";

import React, { useEffect, useState } from "react";

import { isString } from "remeda";

export function FormattedUnits({
	children,
}: {
	children: string | number | null | undefined;
}) {
	const [formattedUnits, setFormattedUnits] = useState<
		string | number | null | undefined
	>(children);

	useEffect(() => {
		let units = children;

		if (!units) return;
		if (isString(units)) {
			units = Number.parseInt(units, 10);
		}

		if (typeof window !== "undefined" && typeof navigator !== "undefined") {
			units = new Intl.NumberFormat(navigator.language, {
				notation: "compact",
				compactDisplay: "short",
			}).format(units as number);
		}

		setFormattedUnits(units);
	}, [children]);

	return <>{formattedUnits}</>;
}
