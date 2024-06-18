import { useCallback, useEffect, useState } from "react";

export type StepState = "idle" | "active" | "completed";

export type StepData = {
	id: string;
	description: string;
};

export type DialogStep = {
	id: StepData["id"];
	description: StepData["description"];
	state: StepState;
};

const useProcessDialog = (steps: StepData[]) => {
	const createDialogSteps = () => {
		const dialogSteps: DialogStep[] = steps.map((step) => ({
			id: step.id,
			description: step.description,
			state: "idle",
		}));
		return dialogSteps;
	};

	const [dialogSteps, setDialogSteps] = useState<DialogStep[]>(
		createDialogSteps(),
	);

	useEffect(() => {
		setDialogSteps(createDialogSteps());
	}, [steps]);

	const setStep = useCallback(
		(step: DialogStep["id"]) => {
			setDialogSteps((dialogStepsVal) => {
				const lastStep = dialogStepsVal[dialogStepsVal.length - 1];
				return dialogStepsVal.map((dialogStep) => {
					if (dialogStep.id === step) {
						return {
							...dialogStep,
							state: dialogStep.id === lastStep.id ? "completed" : "active",
						};
					}
					if (
						dialogStepsVal.indexOf(dialogStep) <
						dialogStepsVal.findIndex((ds) => ds.id === step)
					) {
						return { ...dialogStep, state: "completed" };
					}
					return dialogStep;
				});
			});
		},
		[dialogSteps],
	);

	return {
		dialogSteps,
		setStep,
	};
};

export default useProcessDialog;
