import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateFractionalOrderForm } from "@/components/marketplace/create-fractional-sale-form";

export const ListForSaleForm = ({ hypercertId }: { hypercertId: string }) => {
	const [formStep, setFormStep] = useState<"initial" | "direct" | "fractional">(
		"initial",
	);
	return (
		<form>
			{formStep === "initial" && (
				<div className="flex flex-col items-center space-y-4">
					<h2 className="text-lg">List for sale</h2>
					<p>Choose how you would like to list your hypercert for sale</p>
					<Button
						type="button"
						variant="outline"
						onClick={() => setFormStep("direct")}
					>
						Direct sale
					</Button>
					<Button
						variant="outline"
						type={"button"}
						onClick={() => setFormStep("fractional")}
					>
						Fractional sale
					</Button>
				</div>
			)}
			{formStep === "direct" && (
				<div className="flex flex-col items-center space-y-4">
					<h2 className="text-lg">List for sale</h2>
					<p>Choose how you would like to list your hypercert for sale</p>
					<Button variant="outline">Direct sale</Button>
					<Button variant="outline">Fractional sale</Button>
				</div>
			)}
			{formStep === "fractional" && (
				<CreateFractionalOrderForm hypercertId={hypercertId} />
			)}
		</form>
	);
};
