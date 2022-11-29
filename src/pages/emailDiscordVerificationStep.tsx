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
import { StepPart, Step } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"
import { PageProps } from "./pageProps"

const emailRegex = /^[^@]+@[a-z0-9-]+.[a-z]+$/

const Header = () => <h1 className="h1">03 - Email / Discord verification</h1>

const Body = () => (
	<p className="p">
		Verify your email / discord via the magic link sent to your address.
	</p>
)

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
	}, [email])

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
	}, [inactive, disabled, dispatch, email])

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
	}, [disableSubmit, dispatch])

	const onSubmit = useCallback(() => {
		if (!disableSubmit) {
			dispatch({ type: DataActionTypes.setModal, payload: "emailVerification" })
			dispatch({ type: DataActionTypes.emailChange, payload: emailValue })

			/*dispatch({
				type: DataActionTypes.changePage,
				payload: {
					current: StepID.taxResidenceStep,
					prev: StepID.emailDiscordVerificationStep,
				},
			})*/
		}
	}, [disableSubmit, dispatch, emailValue])

	const onPrev = useCallback(() => {
		dispatch({
			payload: {
				current: StepID.verificationStep,
				next: StepID.emailDiscordVerificationStep,
			},
			type: DataActionTypes.changePage,
		})
	}, [dispatch])

	useEffect(() => {
		if (!disabled && !inactive) {
			const next = OnNext.subscribe(onSubmit)
			const prev = OnPrev.subscribe(onPrev)

			return () => {
				prev.unsubscribe()
				next.unsubscribe()
			}
		}
	}, [onSubmit, disabled, inactive, dispatch, onPrev])

	const onEmailChange = useCallback((value: string) => {
		setEmailValue(value)
	}, [])

	const footer = useCallback<StepPart>(
		({ disabled, inactive, onNext, onInputBlurred, onInputFocused }) => (
			<>
				<Input
					onInputBlurred={onInputBlurred}
					onInputFocused={onInputFocused}
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
					onClick={onNext}
				/>
			</>
		),
		[inputRef, emailValue, onEmailChange, buttonAutofocus, disableSubmit]
	)

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
			footer={footer}
			body={Body}
			header={Header}
		/>
	)
}
