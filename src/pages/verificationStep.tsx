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
import { H1, Li, P, Ul } from "@Style/index"

const Footer: StepPart = ({ disabled, inactive, onEnter }) => (
	<SubmitButton
		black
		fullWidth
		autoFocus={!disabled && !inactive}
		disabled={disabled}
		inactive={inactive}
		onClick={onEnter}
	/>
)

const Header = () => (
	<H1>
		<Logo />
		Open account
	</H1>
)

const Body = () => {
	return (
		<>
			<P>
				Our partners use 3rd party partners to collect information for
				verification.
			</P>
			<P>During the account opening you will be asked:</P>
			<Ul>
				<Li>
					<P>Government ID</P>
				</Li>
				<Li>
					<P>Selfie</P>
				</Li>
				<Li>
					<P>Tax residency</P>
				</Li>
			</Ul>
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
