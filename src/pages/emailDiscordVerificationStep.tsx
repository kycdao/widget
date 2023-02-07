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

import { PageProps } from "./pageProps"
import { useKycDao } from "@Hooks/useKycDao"
import {
	DataActionTypes,
	H1,
	HeaderButtons,
	Input,
	Logo,
	OnNext,
	OnPrev,
	P,
	StateContext,
	Step,
	StepID,
	StepPart,
	SubmitButton,
} from "@Components/index"
import useChangePage from "@Hooks/useChangePage"

const emailRegex = /^[^@]+@[a-z0-9-]+.[a-z]+$/

const Header = () => (
	<H1>
		<Logo />
		Email verification
	</H1>
)

const Body = () => (
	<P>
		Verify your email via the magic link sent to you. <br /> <br />
		kycDAO won’t know who you are, your account is with our partners. <br />
		Yet, we need to establish a communication channel with members.
	</P>
)

export const EmailDiscordVerificationStep: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const {
		data: { email, currentModal, isEmailConfirmed },
		dispatch,
	} = useContext(StateContext)
	const redirect = useChangePage()
	const kycDao = useKycDao()

	const [buttonAutofocus, setButtonAutoFocus] = useState(false)

	const [emailValue, setEmailValue] = useState("")

	const confirmationInterval = useRef<NodeJS.Timer>()

	useLayoutEffect(() => {
		if (email !== "") {
			setEmailValue(email)
			setButtonAutoFocus(true)
		}
	}, [email])

	// We can rework this, input has autofocus now
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
		if (!currentModal && confirmationInterval.current) {
			clearInterval(confirmationInterval.current)
		}
	}, [currentModal])

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
		if (!disableSubmit && kycDao) {
			if (!isEmailConfirmed) {
				dispatch({
					type: DataActionTypes.setModal,
					payload: "emailVerification",
				})
				dispatch({ type: DataActionTypes.emailChange, payload: emailValue })

				try {
					await kycDao.kycDao.updateEmail(emailValue)

					const emailCheck = async () => {
						try {
							const emailData = await kycDao?.kycDao.checkEmailConfirmed()

							if (emailData?.isConfirmed) {
								dispatch({
									type: DataActionTypes.setEmailConfirmed,
									payload: true,
								})

								redirect(
									StepID.taxResidenceStep,
									StepID.emailDiscordVerificationStep
								)

								dispatch({
									type: DataActionTypes.setModal,
									payload: null,
								})

								clearInterval(confirmationInterval.current)
							}
						} catch (e) {
							dispatch({
								type: DataActionTypes.SetErrorModalText,
								payload: {
									header: "An error happened",
									body: "Email validation failed, because of an error. Please try again.",
								},
							})
							dispatch({
								type: DataActionTypes.setModal,
								payload: "genericError",
							})
							if (typeof e === "string" || e instanceof Error) {
								console.error(e)
							} else {
								console.error(JSON.stringify(e))
							}
						}
					}
					confirmationInterval.current = setInterval(emailCheck, 1500)
				} catch (e) {
					dispatch({
						type: DataActionTypes.SetErrorModalText,
						payload: {
							header: "An error happened",
							body: "Email validation failed, because of an error. Please try again.",
						},
					})
					dispatch({ type: DataActionTypes.setModal, payload: "genericError" })
					if (typeof e === "string" || e instanceof Error) {
						console.error(e)
					} else {
						console.error(JSON.stringify(e))
					}
				}
			} else {
				redirect(StepID.taxResidenceStep, StepID.emailDiscordVerificationStep)
			}
		}
	}, [disableSubmit, kycDao, isEmailConfirmed, dispatch, emailValue, redirect])

	const onPrev = useCallback(() => {
		clearInterval(confirmationInterval.current)
		redirect(
			StepID.verificationStep,
			StepID.emailDiscordVerificationStep,
			"prev"
		)
	}, [redirect])

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

	const onEmailChange = useCallback(
		(value: string) => {
			setEmailValue(value)
			dispatch({ type: DataActionTypes.setEmailConfirmed, payload: false })
		},
		[dispatch]
	)

	const footer = useCallback<StepPart>(
		({ disabled, inactive, onNext, onInputBlurred, onInputFocused }) => (
			<>
				<Input
					onInputBlurred={onInputBlurred}
					onInputFocused={onInputFocused}
					inputRef={inputRef}
					disabled={disabled}
					fullWidth
					value={emailValue}
					placeholder={"email"}
					onChange={onEmailChange}
					type="email"
				/>
				<SubmitButton
					black
					fullWidth
					autoFocus={buttonAutofocus}
					inactive={inactive}
					disabled={disableSubmit || disabled}
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
