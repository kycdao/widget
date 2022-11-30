import { useContext, useCallback, FC, useEffect } from "react"
import {
	StateContext,
	StepID,
	DataActionTypes,
	HeaderButtons,
	OnPrev,
} from "../components/stateContext"
import { StepPart, Step } from "../components/step/step"
import { OnNext } from "../components/stateContext/stateContext"
import { SubmitButton } from "../components/submitButton/submitButton"
import { PageProps } from "./pageProps"

const Footer: StepPart = ({ disabled, inactive, onEnter }) => (
	<SubmitButton
		autoFocus={!disabled && !inactive}
		disabled={disabled}
		inactive={inactive}
		className="full-width black"
		onClick={onEnter}
	/>
)

const Header = () =>
<h1 className="h1">
	<span className="logo">
		<svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path fill-rule="evenodd" clip-rule="evenodd" d="M16.0007 1.39121L14.6095 0L8.00129 6.60825L6.26227 4.86924L4.87106 6.26045L8.00129 9.39067L16.0007 1.39121ZM0.00195312 1.39146L3.47998 4.86948L4.87119 3.47827L1.39316 0.00024517L0.00195312 1.39146Z" fill="black"/>
		<path fill-rule="evenodd" clip-rule="evenodd" d="M15.9982 12.9811L14.607 11.5898L7.99872 18.1981L6.25971 16.4591L4.8685 17.8503L7.99872 20.9805L15.9982 12.9811ZM0 12.9817L3.47803 16.4598L4.86924 15.0686L1.39121 11.5905L0 12.9817Z" fill="black"/>
		<path fill-rule="evenodd" clip-rule="evenodd" d="M15.999 7.07871L12.521 10.5567L11.1298 9.16553L14.6078 5.6875L15.999 7.07871ZM0.000940445 7.07903L1.39215 5.68782L8.0004 12.2961L9.73941 10.5571L11.1306 11.9483L8.0004 15.0785L0.000940445 7.07903Z" fill="black"/>
		</svg>
	</span>
	02 - ID Verification
</h1>

const Body = () => {
	return (
		<>
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
