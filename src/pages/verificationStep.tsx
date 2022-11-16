import { useContext, useCallback, FC, useEffect } from "react"
import {
	StateContext,
	StepID,
	DataActionTypes,
	HeaderButtons,
	OnPrev,
} from "../components/stateContext"
import { Step } from "../components/step/step"
import { OnNext } from "../components/stateContext"
import { SubmitButton } from "../components/submitButton/submitButton"
import { PageProps } from "./pageProps"

export const VerificationStep: FC<PageProps> = ({
	className,
	disabled = false,
	animation,
	inactive = false,
}) => {
	const { dispatch } = useContext(StateContext)

	const onSubmit = useCallback(() => {
		dispatch({
			type: DataActionTypes.changePage,
			payload: {
				current: StepID.emailDiscordVerificationStep,
				prev: StepID.verificationStep,
			},
		})
	}, [dispatch])

	useEffect(() => {
		if (!disabled && !inactive) {
			const next = OnNext.subscribe(onSubmit)
			return next.unsubscribe.bind(next)
		}
	}, [disabled, inactive, onSubmit])

	const onPrev = useCallback(() => {
		dispatch({
			payload: {
				current: StepID.kycDAOMembershipStep,
				next: StepID.verificationStep,
			},
			type: DataActionTypes.changePage,
		})
	}, [dispatch])

	useEffect(() => {
		if (!disabled && !inactive) {
			const prev = OnPrev.subscribe(onPrev)
			return prev.unsubscribe.bind(prev)
		}
	}, [disabled, inactive, onPrev])

	const onStateChange = () => {
		if (!disabled && !inactive) {
			dispatch({
				payload: { button: HeaderButtons.prev, state: "enabled" },
				type: DataActionTypes.SetHeaderButtonState,
			})
			dispatch({
				payload: { button: HeaderButtons.next, state: "enabled" },
				type: DataActionTypes.SetHeaderButtonState,
			})
		}
	}

	return (
		<Step
			onPrev={onPrev}
			onNext={onSubmit}
			onTransitionDone={onStateChange}
			inactive={inactive}
			disabled={disabled}
			animation={animation}
			className={className}
			onEnter={onSubmit}
			footer={({ disabled, inactive }) => (
				<SubmitButton
					autoFocus={!disabled && !inactive}
					disabled={disabled}
					inactive={inactive}
					className="full-width blue"
					onClick={onSubmit}
				/>
			)}>
			<h1 className="h1">02 - ID Verification</h1>
			<p className="p">
				We are using 3rd party partners to collect information for verification.
			</p>
			<p className="p">During the verification you wil be asked:</p>
			<ul>
				<li className="li">
					<p>government ID</p>
				</li>
				<li className="li">
					<p>selfie</p>
				</li>
			</ul>
		</Step>
	)
}
