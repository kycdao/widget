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
import { KycDaoContext } from "../components/kycDao.provider"

const emailRegex = /^[^@]+@[a-z0-9-]+.[a-z]+$/

const Header = () => (
	<h1 className="h1">
		<span className="logo">
			<svg
				width="16"
				height="21"
				viewBox="0 0 16 21"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M16.0007 1.39121L14.6095 0L8.00129 6.60825L6.26227 4.86924L4.87106 6.26045L8.00129 9.39067L16.0007 1.39121ZM0.00195312 1.39146L3.47998 4.86948L4.87119 3.47827L1.39316 0.00024517L0.00195312 1.39146Z"
					fill="black"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M15.9982 12.9811L14.607 11.5898L7.99872 18.1981L6.25971 16.4591L4.8685 17.8503L7.99872 20.9805L15.9982 12.9811ZM0 12.9817L3.47803 16.4598L4.86924 15.0686L1.39121 11.5905L0 12.9817Z"
					fill="black"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M15.999 7.07871L12.521 10.5567L11.1298 9.16553L14.6078 5.6875L15.999 7.07871ZM0.000940445 7.07903L1.39215 5.68782L8.0004 12.2961L9.73941 10.5571L11.1306 11.9483L8.0004 15.0785L0.000940445 7.07903Z"
					fill="black"
				/>
			</svg>
		</span>
		Email verification
	</h1>
)

const Body = () => (
	<p className="p">
		Verify your email via the magic link sent to you. <br/> <br/>
		kycDAO won’t know who you are, your account is with our partners. <br/>
		Yet, we need to establish a communication channel with members.
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

	const kycDao = useContext(KycDaoContext)

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

	const onSubmit = useCallback(async () => {
		if (!disableSubmit) {
			dispatch({ type: DataActionTypes.setModal, payload: "emailVerification" })
			dispatch({ type: DataActionTypes.emailChange, payload: emailValue })

			try {
				await kycDao?.kycDao.registerOrLogin()
				await kycDao?.kycDao.updateEmail(emailValue)

				const emailCheck = async () => {
					const emailData = { isConfirmed: true } // await kycDao?.kycDao.checkEmailConfirmed()

					if (emailData?.isConfirmed) {
						dispatch({ type: DataActionTypes.setEmailConfirmed, payload: true })
						dispatch({
							type: DataActionTypes.changePage,
							payload: {
								current: StepID.taxResidenceStep,
								prev: StepID.emailDiscordVerificationStep,
							},
						})
						dispatch({
							type: DataActionTypes.setModal,
							payload: null,
						})

						return true
					} else {
						return false
					}
				}

				if (!(await emailCheck())) {
					const interval = setInterval(emailCheck, 1500)

					return () => clearInterval(interval)
				}
			} catch (e) {
				alert(e)
			}
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
					type="email"
				/>
				<SubmitButton
					autoFocus={buttonAutofocus}
					inactive={inactive}
					disabled={disableSubmit || disabled}
					className="full-width black"
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
