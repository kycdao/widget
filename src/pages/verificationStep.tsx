import { useContext, useCallback, FC, useEffect } from "react"
import {
	StateContext,
	StepID,
	DataActionTypes,
	HeaderButtons,
	OnPrev,
	OnNext,
} from "@Components/stateContext"
import { StepPart, Step } from "@Components/step/step"
import { SubmitButton } from "@Components/submitButton/submitButton"
import { PageProps } from "./pageProps"
import { Logo } from "@Components/logo/logo"

const Footer: StepPart = ({ disabled, inactive, onEnter }) => (
	<SubmitButton
		autoFocus={!disabled && !inactive}
		disabled={disabled}
		inactive={inactive}
		className="full-width black"
		onClick={onEnter}
	/>
)

const Header = () => (
	<h1 className="h1">
		<Logo />
		Open account
	</h1>
)

const Body = () => {
	return (
		<>
			<p className="p">
				Our partners use 3rd party partners to collect information for
				verification.
			</p>
			<p className="p">During the account opening you will be asked:</p>
			<ul>
				<li className="li">
					<p>Government ID</p>
				</li>
				<li className="li">
					<p>Selfie</p>
				</li>
				<li className="li">
					<p>Tax residency</p>
				</li>
			</ul>
		</>
	)
}

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

	const onStateChange = useCallback(() => {
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
	}, [disabled, dispatch, inactive])

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
			footer={Footer}
			body={Body}
			header={Header}
		/>
	)
}
