import { Data, StepID } from "./stateContextTypes"

export type FlowStep = {
	step: StepID
	startSubFlow?: (data: Data) => Flow | undefined
}

export type Flow = {
	steps: {
		step: StepID
		startSubFlow?: (data: Data) => Flow | undefined
	}[]
}

export const ReturningUserFlow = {
	steps: [
		{ step: StepID.subscribedStartStep },
		{ step: StepID.nftArtSelection },
		{ step: StepID.finalStep },
	],
} as Flow

const VerificationFlow = {
	steps: [{ step: StepID.taxResidenceStep }, { step: StepID.verificationStep }],
} as Flow

export const EmailVerificationFlow = {
	steps: [{ step: StepID.verifyAccountStep, ...VerificationFlow.steps }],
} as Flow

export const NewSubscriberFlow = {
	steps: [
		{ step: StepID.AgreementStep },
		{
			step: StepID.kycDAOMembershipStep,
			startSubFlow: ({ isEmailConfirmed }) => {
				if (!isEmailConfirmed) {
					return EmailVerificationFlow
				}
			},
		},
		{ step: StepID.nftArtSelection },
		{ step: StepID.kycDAOMembershipStep },
		{ step: StepID.finalStep },
	],
} as Flow

export const AlreadHaveNftFlow = {
	steps: [{ step: StepID.finalStep }],
} as Flow

export const MainFlow = {
	steps: [
		{
			step: StepID.loading,
			startSubFlow: ({ alreadyHaveAnNftOnThisChain, returningUserFlow }) => {
				if (alreadyHaveAnNftOnThisChain) {
					return AlreadHaveNftFlow
				} else if (returningUserFlow) {
					return ReturningUserFlow
				} else {
					return NewSubscriberFlow
				}
			},
		},
	],
} as Flow

export type PageFlow = { steps: StepID[]; getSubFlow?: (data: Data) => Flow }

export const VerifyMailSubFlow = []
export const VerifySubFlow = []

function last<T>(this: Array<T>) {
	return this.at(this.length - 1)
}

/**
 * Gets back the step
 * @param data The current state
 * @returns The new state, with the next step
 */
export function CalculateNextStep(data: Data): Data {
	const { flowStack, stepIndices } = data

	if (flowStack.length === 0) {
		return data
	}

	const currentFlow = last.call(flowStack) as Flow | undefined

	/**
	 * If there is a flow running
	 */
	if (currentFlow) {
		const currentStepIndex = last.call(stepIndices) as StepID | undefined

		/**
		 * If there is a current step
		 */
		if (currentStepIndex) {
			const lastFlowStep = currentFlow.steps[currentStepIndex]

			/**
			 * If there are subflows, then we have to check if the app has to go to on a subflow
			 */
			if (lastFlowStep.startSubFlow) {
				const nextSubflow: Flow | undefined = lastFlowStep.startSubFlow(data)
				/**
				 * If it has to go on a subflow, then the first step of the subflow will be the next step.
				 * We push the current step index into the flow stack. If there is none, then go with the
				 * next step inside the flow
				 */
				if (nextSubflow) {
					const [nextStep] = nextSubflow.steps

					flowStack.push(nextSubflow)
					stepIndices.push(nextStep.step)

					return {
						...data,
						currentPage: nextStep.step,
						flowStack,
					}
				}
			}

			/** If there are still steps in the flow, then continue with that one, if not, then
			 * pop the flow from the flowstack and continue with that one. If that was the last one,
			 * the flow is done.
			 */
			if (currentFlow && currentFlow.steps.length > currentStepIndex + 1) {
				return { ...data, currentPage: currentStepIndex + 1 }
			} else {
				while (flowStack.length === 0) {
					flowStack.pop()
					const prevFlow = last.call(flowStack) as Flow | undefined

					/**
					 * If there is no previous flow, then the program is done
					 */
					if (!prevFlow) {
						return data
					}

					stepIndices.pop()

					const prevStepIndex = last.call(stepIndices) as StepID | undefined

					/**
					 * If there is no steps in the flow anymore, then it is done
					 */
					if (!prevStepIndex) {
						continue
					}

					if (
						prevFlow &&
						prevStepIndex &&
						prevFlow.steps.length > prevStepIndex + 1
					) {
						return {
							...data,
							currentPage: prevStepIndex + 1,
							flowStack,
							stepIndices,
						}
					}
				}
			}
		}
	}
	return data
}
