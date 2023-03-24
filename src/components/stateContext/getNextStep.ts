import { lastItem } from "@Utils/lastItem"
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

export const GrantFlow = {
	steps: [
		{ step: StepID.grantSocialSecurityNumberStep },
		{ step: StepID.grantNameAndAddressStep },
	],
} as Flow

export const ReturningUserFlow = {
	steps: [
		{ step: StepID.subscribedStartStep },
		{ step: StepID.nftArtSelection },
		{ step: StepID.finalStep },
	],
} as Flow

const VerificationFlow = {
	steps: [
		{ step: StepID.taxResidenceStep },
		{
			step: StepID.verificationStep,
			startSubFlow: ({ grantFlowEnabled }) => {
				if (grantFlowEnabled) {
					return GrantFlow
				}
			},
		},
	],
} as Flow

export const EmailVerificationFlow = {
	steps: [
		{ step: StepID.verifyAccountStep },
		{ step: StepID.emailDiscordVerificationStep },
	],
} as Flow

export const NewSubscriberFlow = {
	steps: [
		{ step: StepID.AgreementStep },
		{
			step: StepID.kycDAOMembershipStep,
			startSubFlow: ({ isEmailConfirmed, returningUserFlow }) => {
				if (!isEmailConfirmed) {
					return EmailVerificationFlow
				}
				if (!returningUserFlow) {
					return VerificationFlow
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

/**
 * Gets back the step
 * @param data The current state
 * @param direction The direction to go
 * @returns The new state, with the next step
 */
export function CalculateStep(data: Data, direction: boolean): Data {
	const { flowStack, stepIndices, currentPage: prevPage, error } = data

	/**
	 * Check for fatal error, it is allways a priority
	 */
	if (error?.type === "fatal") {
		return {
			...data,
			prevPage,
			currentPage: StepID.fatalError,
		}
	}

	const offset = direction ? 1 : -1

	if (flowStack.length === 0) {
		return data
	}

	const currentFlow = lastItem.call(flowStack) as Flow | undefined

	/**
	 * If there is a flow running
	 */
	if (currentFlow) {
		const currentStepIndex = lastItem.call(stepIndices) as number | undefined

		/**
		 * If there is a current step
		 */
		if (typeof currentStepIndex !== "undefined") {
			const lastFlowStep = currentFlow.steps[currentStepIndex]

			/**
			 * If there are subflows, then we have to check if the app has to go to on a subflow, only if we are going forward
			 */
			if (direction && lastFlowStep.startSubFlow) {
				const nextSubflow: Flow | undefined = lastFlowStep.startSubFlow(data)
				/**
				 * If it has to go on a subflow, then the first step of the subflow will be the next step.
				 * We push the current step index into the flow stack. If there is none, then go with the
				 * next step inside the flow
				 */
				if (nextSubflow) {
					const [nextStep] = nextSubflow.steps

					flowStack.push(nextSubflow)
					stepIndices.push(0)

					return {
						...data,
						currentPage: nextStep.step,
						prevPage,
						flowStack,
					}
				}
			}

			let newIndex = currentStepIndex + offset

			/** If there are still steps in the flow, then continue with that one, if not, then
			 * pop the flow from the flowstack and continue with that one. If that was the last one,
			 * the flow is done.
			 */
			if (currentFlow && currentFlow.steps.length > newIndex && 0 <= newIndex) {
				const stepIndices = [...data.stepIndices]
				stepIndices[stepIndices.length - 1] = newIndex

				return {
					...data,
					...{
						prevPage: offset === 1 ? prevPage : undefined,
						nextPage: offset === -1 ? prevPage : undefined,
					},
					currentPage: currentFlow.steps[newIndex].step,
					stepIndices,
				}
			} else {
				while (flowStack.length !== 0) {
					flowStack.pop()
					const prevFlow = lastItem.call(flowStack) as Flow | undefined

					/**
					 * If there is no previous flow, then the program is done
					 */
					if (!prevFlow) {
						return data
					}

					stepIndices.pop()

					const prevStepIndex = lastItem.call(stepIndices) as number | undefined

					/**
					 * If there is no steps in the flow anymore, then it is done
					 */
					if (!prevStepIndex) {
						continue
					}

					newIndex = prevStepIndex + offset === -1 ? 0 : 1

					if (prevFlow && prevStepIndex && prevFlow.steps.length > newIndex) {
						stepIndices[stepIndices.length - 1] = newIndex

						return {
							...data,
							currentPage: prevFlow.steps[newIndex].step,
							...{
								prevPage: offset === 1 ? prevPage : undefined,
								nextPage: offset === -1 ? prevPage : undefined,
							},
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

export const CalculateNextStep = (data: Data) => CalculateStep(data, true)
export const CalculatePrevStep = (data: Data) => CalculateStep(data, false)
