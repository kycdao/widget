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
import styled from "styled-components/macro"
import UnstyledDiscordLogo from "../images/discord.svg"
import useErrorHandler from "@Hooks/errorHandler"

const emailRegex = /^[^@]+@[a-z0-9-]+.[a-z]+$/

const Header = () => (
	<H1>
		<Logo />
		Confirm your email
	</H1>
)

const DiscordLogo = styled.img`
	width: 32px;
`

const ConnectDiscordLabel = styled(P)`
	margin-block: auto;
	margin-inline: 1em;
`

const DiscordContainer = styled.div`
	display: flex;
	justify-content: start;
`

const DiscordLogoContainer = styled.div`
	color: black;
	background: var(--kyc-sdk-cybergreen);
	width: 64px;
	height: 64px;
	border-radius: var(--kyc-sdk-border-radius-light);
	display: flex;
	justify-content: center;
`

const Body = () => (
	<>
		<P>Please confirm your email by clicking the magic link we will send.</P>
		<P>
			This is important for us to maintain effective communication with our
			members.
		</P>
	</>
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
	const errorHandler = useErrorHandler()

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
									StepID.verificationStep,
									StepID.emailDiscordVerificationStep
								)

								dispatch({
									type: DataActionTypes.setModal,
									payload: null,
								})

								clearInterval(confirmationInterval.current)
							}
						} catch (error) {
							errorHandler("modal", error)
						}
					}
					confirmationInterval.current = setInterval(emailCheck, 1500)
				} catch (error) {
					errorHandler("modal", error)
				}
			} else {
				redirect(StepID.taxResidenceStep, StepID.emailDiscordVerificationStep)
			}
		}
	}, [
		disableSubmit,
		kycDao,
		isEmailConfirmed,
		dispatch,
		emailValue,
		redirect,
		errorHandler,
	])

	const onPrev = useCallback(() => {
		clearInterval(confirmationInterval.current)
		dispatch({ type: DataActionTypes.GoToPrevStep })
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
				<DiscordContainer style={{ display: "none" }}>
					<DiscordLogoContainer>
						<DiscordLogo src={UnstyledDiscordLogo} />
					</DiscordLogoContainer>
					<ConnectDiscordLabel>Connect Discord Soon</ConnectDiscordLabel>
				</DiscordContainer>
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
