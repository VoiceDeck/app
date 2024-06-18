import { buttonVariants } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import useProcessDialog, {
	type DialogStep,
	type StepData,
	type StepState,
} from "@/hooks/use-process-dialog";
import { cn } from "@/lib/utils";
import { Badge, BadgeCheck, Loader } from "lucide-react";
import type React from "react";
import { createContext, createElement, useContext, useState } from "react";

interface DialogProps {
	steps: DialogStep[];
	title: string;
	triggerLabel?: string;
	extraContent?: React.ReactNode;
	open?: boolean;
}

const stepStateIcons: Record<StepState, React.ElementType> = {
	idle: Badge,
	active: Loader,
	completed: BadgeCheck,
};

const stateSpecificIconClasses: Record<StepState, string> = {
	idle: "text-slate-600",
	active: "text-slate-700 animate-spin bg-white rounded-full",
	completed: "text-slate-400",
};

const stateSpecificTextClasses: Record<StepState, string> = {
	idle: "text-slate-600 font-medium",
	active: "text-slate-700 animate-pulse font-semibold",
	completed: "text-slate-400 font-medium",
};

const StepProcessModal = ({
	steps,
	title,
	triggerLabel,
	extraContent,
	open: openProp,
}: DialogProps) => {
	const lastStep = steps[steps.length - 1];
	const isLastStepCompleted = lastStep?.state === "completed";
	const [open, setOpen] = useState(true);

	const defOpen = openProp ?? open;

	return (
		<Dialog open={defOpen} onOpenChange={setOpen}>
			{triggerLabel && (
				<DialogTrigger
					asChild
					className={buttonVariants({ variant: "secondary" })}
				>
					{triggerLabel}
				</DialogTrigger>
			)}
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="font-normal font-serif text-3xl">
						{title}
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col px-2 pt-3">
					{steps.map((step) => (
						<div
							key={step.description}
							className="relative flex items-center border-slate-300 border-l-2 pb-6 pl-2 last-of-type:pb-0"
						>
							<div
								className={cn(
									"-left-[14px] absolute top-[2px] rounded-full bg-slate-100 p-1",
									stateSpecificIconClasses[step.state],
									step === lastStep &&
										isLastStepCompleted &&
										"bg-green-100 text-green-600",
								)}
							>
								{createElement(stepStateIcons[step.state], {
									size: 18,
								})}
							</div>
							<div className="flex flex-col justify-center pl-4">
								<p
									className={cn(
										"text-lg",
										stateSpecificTextClasses[step.state],
										step === lastStep &&
											isLastStepCompleted &&
											"text-green-600",
									)}
								>
									{step.description}
								</p>
							</div>
						</div>
					))}
				</div>
				<div className="flex flex-col px-2 pt-3">{extraContent}</div>
			</DialogContent>
		</Dialog>
	);
};

export const StepProcessDialogContext = createContext<{
	setStep: (step: DialogStep["id"]) => void;
	setSteps: (steps: StepData[]) => void;
	setOpen: (open: boolean) => void;
}>({
	setStep: () => {},
	setSteps: () => {},
	setOpen: () => {},
});

export const StepProcessDialogProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [steps, setSteps] = useState<StepData[]>([]);
	const { setStep, dialogSteps } = useProcessDialog(steps);
	const [open, setOpen] = useState(false);
	return (
		<StepProcessDialogContext.Provider
			value={{
				setStep,
				setSteps,
				setOpen,
			}}
		>
			{children}
			<StepProcessModal open={open} steps={dialogSteps} title="Test title" />
		</StepProcessDialogContext.Provider>
	);
};

export const useStepProcessDialogContext = () =>
	useContext(StepProcessDialogContext);

export { StepProcessModal as default };
