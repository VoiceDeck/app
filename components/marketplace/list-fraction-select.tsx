import { Circle, CircleCheck } from "lucide-react";

import { FormattedUnits } from "@/components/marketplace/formatted-units";
import { cn } from "@/lib/utils";
import { round } from "remeda";

type Fraction = {
	units: string | null | undefined;
	fraction_id: string | null;
};

export default function ListFractionSelect({
	fraction,
	units,
	selected,
	setSelected,
}: {
	fraction: Fraction;
	units: number;
	selected: boolean;
	setSelected: (fractionId: string) => void;
}) {
	if (!fraction.fraction_id) return;

	const fractionUnits = Number.parseInt(fraction.units || "0", 10);
	const fractionId = `${fraction.fraction_id.slice(
		0,
		3,
	)}...${fraction.fraction_id.slice(-3)}`;
	const fractionShare = round((fractionUnits / units) * 100, 2);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<tr
			onClick={() => setSelected(fraction.fraction_id || "")}
			className={cn(
				"h-12 rounded-2xl border border-gray-200 text-sm hover:bg-gray-100",
				selected && "",
			)}
		>
			<td className="pl-3">{selected ? <CircleCheck /> : <Circle />}</td>
			<td>{fractionId}</td>
			<td>
				<FormattedUnits>{fractionUnits}</FormattedUnits>
			</td>
			<td className="pr-3">{fractionShare}%</td>
		</tr>
	);
}
