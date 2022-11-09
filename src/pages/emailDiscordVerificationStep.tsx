import {
	useContext,
	useCallback,
	useMemo,
	FC,
	useEffect,
	useState,
	useLayoutEffect,
	useRef,
} from "react"
import { Input } from "../components/input/input.component"
import {
	StateContext,
	StepID,
	DataActionTypes,
	HeaderButtons,
	OnNext,
	OnPrev,
} from "../components/stateContext"
import { Step } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"
import { PageProps } from "./pageProps"

const emailRegex = /^[^@]+@[a-z0-9-]+.[a-z]+$/

export const EmailDiscordVerificationStep: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const {
		data: { email },
		dispatch,
	} = useContext(StateContext)
	const [buttonAutofocus, setButtonAutoFocus] = useState(false)

	const [emailValue, setEmailValue] = useState("")

	useLayoutEffect(() => {
		if (email !== "") {
			setEmailValue(email)
			setButtonAutoFocus(true)
		}
	}, [])

	const inputRef = useRef<HTMLInputElement>(null)

	const onTransitionDone = useCallback(() => {
		if (!disabled && !inactive) {
			if (email === "") {
				inputRef.current?.focus()
			}
			dispatch({
				payload: { button: HeaderButtons.prev, state: "enabled" },
				type: DataActionTypes.SetHeaderButtonState,
			})
			dispatch({
				payload: {
					button: HeaderButtons.next,
					state: email ? "enabled" : "hidden",
				},
				type: DataActionTypes.SetHeaderButtonState,
			})
		}
	}, [inactive, disabled])

	const disableSubmit = useMemo(
		() => !emailRegex.test(emailValue),
		[emailValue]
	)

	useEffect(() => {
		dispatch({
			payload: {
				button: HeaderButtons.next,
				state: disableSubmit ? "hidden" : "enabled",
			},
			type: DataActionTypes.SetHeaderButtonState,
		})
	}, [disableSubmit])

	const onSubmit = useCallback(() => {
		if (!disableSubmit) {
			dispatch({ type: DataActionTypes.emailChange, payload: emailValue })
			dispatch({
				type: DataActionTypes.changePage,
				payload: {
					current: StepID.taxResidenceStep,
					prev: StepID.emailDiscordVerificationStep,
				},
			})
		}
	}, [disableSubmit, emailValue])

	const onPrev = useCallback(() => {
		dispatch({
			payload: {
				current: StepID.verificationStep,
				next: StepID.emailDiscordVerificationStep,
			},
			type: DataActionTypes.changePage,
		})
	}, [])

	useEffect(() => {
		if (!disabled && !inactive) {
			const next = OnNext.subscribe(onSubmit)
			const prev = OnPrev.subscribe(onPrev)

			return () => {
				prev.unsubscribe()
				next.unsubscribe()
			}
		}
	}, [onSubmit, disabled, inactive])

	const onEmailChange = useCallback((value: string) => {
		setEmailValue(value)
	}, [])

	return (
		<Step
			onNext={onSubmit}
			onPrev={onPrev}
			onTransitionDone={onTransitionDone}
			disabled={disabled}
			inactive={inactive}
			animation={animation}
			className={className}
			onEnter={onSubmit}
			footer={({ disabled, inactive }) => (
				<>
					<Input
						inputRef={inputRef}
						disabled={disabled}
						value={emailValue}
						placeholder={"email"}
						className="full-width"
						onChange={onEmailChange}
					/>
					<SubmitButton
						autoFocus={buttonAutofocus}
						inactive={inactive}
						disabled={disableSubmit || disabled}
						className="full-width blue"
						onClick={onSubmit}
					/>
				</>
			)}>
			<h1 className="h1">03 - Email / Discord verification</h1>
			<p className="p">
				Verify your email / discord via the magic link sent to your address.
			</p>
		</Step>
	)
}
