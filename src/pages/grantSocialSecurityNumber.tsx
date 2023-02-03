import { PageProps } from "./pageProps"
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
import React, {
	FC,
	useState,
	useContext,
	useEffect,
	useCallback,
	useMemo,
} from "react"
import useChangePage from "@Hooks/useChangePage"

const Body: React.FC = () => {
	return (
		<>
			<H1>
				<Logo />
				Social Security Number - SSN
			</H1>
			<P>Please share your Social Security Number.</P>
		</>
	)
}

export const GrantSocialSecurityNumber: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const {
		dispatch,
		data: { grantFlow },
	} = useContext(StateContext)
	const redirect = useChangePage()
	const [socialSecurityNumber, setSocialSecurityNumber] = useState<string>()
	const isStepValid = useMemo(
		() => !!socialSecurityNumber,
		[socialSecurityNumber]
	)

	const onTransitionDone = useCallback(() => {
		if (!disabled && !inactive) {
			dispatch({
				payload: { button: HeaderButtons.prev, state: "enabled" },
				type: DataActionTypes.SetHeaderButtonState,
			})
			dispatch({
				payload: {
					button: HeaderButtons.next,
					state: grantFlow.socialSecurityNumber ? "enabled" : "hidden",
				},
				type: DataActionTypes.SetHeaderButtonState,
			})
		}
	}, [inactive, disabled, dispatch, grantFlow])

	const onSubmit = useCallback(async () => {
		if (disabled || inactive || !isStepValid) {
			return
		}

		await redirect(
			StepID.beginVerificationStep,
			StepID.grantSocialSecurityNumberStep
		)
	}, [disabled, inactive, isStepValid, redirect])

	const onPrev = useCallback(async () => {
		await redirect(
			StepID.grantNameAndAddressStep,
			StepID.grantSocialSecurityNumberStep
		)
	}, [redirect])

	useEffect(() => {
		dispatch({
			type: DataActionTypes.grantSocialSecurityNumberChange,
			payload: socialSecurityNumber,
		})
	}, [socialSecurityNumber, dispatch])

	useEffect(() => {
		if (!disabled && !inactive) {
			const prev = OnPrev.subscribe(onPrev)
			const next = OnNext.subscribe(onSubmit)

			return () => {
				prev.unsubscribe()
				next.unsubscribe()
			}
		}
	}, [onSubmit, disabled, inactive, onPrev])

	const footer = useCallback<StepPart>(
		({ disabled, inactive, onEnter, onInputBlurred, onInputFocused }) => (
			<>
				<Input
					onInputBlurred={onInputBlurred}
					onInputFocused={onInputFocused}
					disabled={disabled}
					value={socialSecurityNumber}
					placeholder="Social Security Number"
					autoFocus={!isStepValid && !inactive}
					fullWidth
					onChange={(value) => setSocialSecurityNumber(value)}
				/>
				<SubmitButton
					black
					fullWidth
					inactive={inactive}
					disabled={disabled || !isStepValid}
					onClick={onEnter}
				/>
			</>
		),
		[socialSecurityNumber, isStepValid, setSocialSecurityNumber]
	)

	return (
		<Step
			onNext={onSubmit}
			onPrev={onPrev}
			inactive={inactive}
			onTransitionDone={onTransitionDone}
			disabled={disabled}
			animation={animation}
			className={className}
			onEnter={onSubmit}
			footer={footer}
			body={Body}
		/>
	)
}
