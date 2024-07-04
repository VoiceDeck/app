import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { FormattedUnits } from "@/components/marketplace/formatted-units";
import { ListAskedPrice } from "@/components/marketplace/list-asked-price";
import ListDialogSettingsForm from "@/components/marketplace/list-dialog-settings-form";
import ListFractionSelect from "@/components/marketplace/list-fraction-select";
import type { HypercertFull } from "@/hypercerts/fragments/hypercert-full.fragment";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useCreateFractionalMakerAsk } from "../../marketplace/hooks";
import { Button } from "../ui/button";

type State = {
	fractionId: string;
	price: string;
	currency: string;
	unitsForSale?: string;
	unitsMinPerOrder?: string;
	unitsMaxPerOrder?: string;
	formIsValid: boolean;
};

export default function ListDialog({
	hypercert,
	setIsOpen,
}: {
	hypercert: HypercertFull;
	setIsOpen: (isOpen: boolean) => void;
}) {
	const { address } = useAccount();
	const { mutateAsync: createFractionalMakerAsk, isPending } =
		useCreateFractionalMakerAsk({
			hypercertId: hypercert.hypercert_id || "",
		});

	const units = Number.parseInt(hypercert.units || "0");
	const fractions = hypercert.fractions?.data || [];
	const fractionsOwnedByUser = fractions.filter(
		(fraction) => fraction.owner_address === address,
	);

	const [state, setState] = useState<State>({
		fractionId: fractions.length === 1 ? fractions[0].fraction_id || "" : "",
		price: "",
		currency: "ETH",
		unitsForSale: fractions.length === 1 ? fractions[0].units || "" : "",
		unitsMinPerOrder: "1",
		unitsMaxPerOrder: fractions.length === 1 ? fractions[0].units || "" : "",
		formIsValid: true,
	});

	const selectedFraction = fractions.find(
		(fraction) => fraction.fraction_id === state.fractionId,
	);

	const floatPrice = Number.parseFloat(state.price);

	const isPriceValid =
		state.price !== undefined &&
		!Number.isNaN(floatPrice) &&
		state.currency !== undefined;

	const createButtonEnabled = isPriceValid && state.formIsValid;

	const handleListButtonClick = async () => {
		if (
			!createFractionalMakerAsk ||
			!isPriceValid ||
			!state.formIsValid ||
			!state.fractionId ||
			!state.unitsMinPerOrder ||
			!state.unitsForSale
		) {
			return;
		}

		await createFractionalMakerAsk({
			fractionId: state.fractionId,
			minUnitAmount: state.unitsMinPerOrder,
			maxUnitAmount: state.unitsMaxPerOrder || state.unitsForSale,
			minUnitsToKeep: (
				units - Number.parseInt(state.unitsForSale, 10)
			).toString(),
			price: state.price,
			sellLeftoverFraction: false,
		});
	};

	return (
		<DialogContent className="max-w-2xl gap-5">
			<DialogHeader>
				<DialogTitle className="font-medium font-serif text-3xl tracking-tight">
					Create marketplace listing
				</DialogTitle>
			</DialogHeader>

			<div>
				List your hypercert fraction for sale, allowing buyers to directly
				purchase all or part of it. Adjust settings to retain portions for
				yourself or set a minimum transaction amount as needed.
			</div>

			{fractionsOwnedByUser.length > 1 && (
				<div className="font-semibold">
					You are the owner of multiple Hypercert fractions. Which one would you
					like to list on the marketplace?
				</div>
			)}

			<table className="text-right">
				<tbody>
					<tr className="h-10">
						<td className="w-[30%]" />
						<td className="w-[20%]">Fraction Id</td>
						<td className="w-[20%]">Units</td>
						<td className="w-[30%] pr-3">Hypercert share</td>
					</tr>

					{fractionsOwnedByUser.map((fraction) => (
						<ListFractionSelect
							fraction={fraction}
							units={units}
							key={fraction.fraction_id}
							selected={state.fractionId === fraction.fraction_id}
							setSelected={(fractionId) => setState({ ...state, fractionId })}
						/>
					))}
				</tbody>
			</table>

			<div className="flex flex-col gap-2">
				<h5 className="font-medium text-gray-500 text-sm uppercase tracking-wider">
					ASKED SHARE PRICE
				</h5>
				<ListAskedPrice
					price={state.price}
					currency={state.currency}
					setPrice={(price) => setState({ ...state, price })}
					setCurrency={(currency) => setState({ ...state, currency })}
				/>
				{selectedFraction && isPriceValid && (
					<div className="text-gray-500 text-sm">
						Creating this listing will offer{" "}
						<b>
							<FormattedUnits>{state.unitsForSale}</FormattedUnits>
						</b>{" "}
						units for sale at a total price of{" "}
						<b>
							{floatPrice} {state.currency}
						</b>
						.
					</div>
				)}
			</div>
			<div className="flex flex-col gap-2">
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="item-1" className="data-[state=open]:border-0">
						<AccordionTrigger className="font-medium text-gray-500 text-sm uppercase tracking-wider">
							Advanced settings
						</AccordionTrigger>
						<AccordionContent>
							<ListDialogSettingsForm
								selectedFractionUnits={selectedFraction?.units || ""}
								unitsForSale={state.unitsForSale}
								unitsMinPerOrder={state.unitsMinPerOrder}
								unitsMaxPerOrder={state.unitsMaxPerOrder}
								setUnitsForSale={(unitsForSale) =>
									setState({ ...state, unitsForSale })
								}
								setUnitsMinPerOrder={(unitsMinPerOrder) =>
									setState({ ...state, unitsMinPerOrder })
								}
								setUnitsMaxPerOrder={(unitsMaxPerOrder) =>
									setState({ ...state, unitsMaxPerOrder })
								}
								setFormIsValid={(formIsValid) =>
									setState({ ...state, formIsValid })
								}
							/>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>

			<div className="flex justify-evenly gap-2">
				<Button
					variant={"outline"}
					className="w-full"
					onClick={() => setIsOpen(false)}
				>
					Cancel
				</Button>
				<Button
					disabled={!createButtonEnabled}
					className="w-full"
					onClick={handleListButtonClick}
				>
					{isPending && <LoaderCircle className="mr-1 h-4 w-4 animate-spin" />}
					{isPending ? "Creating listing" : "Create listing"}
				</Button>
			</div>
		</DialogContent>
	);
}
