import { PageProps } from "./pageProps"
import {
	DataActionTypes,
	H1,
	HeaderButtons,
	Input,
	KycDaoContext,
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
				Name and address
			</H1>
			<P>Please share your name and current address below.</P>
		</>
	)
}

export const GrantNameAndAddress: FC<PageProps> = ({
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
	const [name, setName] = useState<string>()
	const [address, setAddress] = useState<string>()
	const isStepValid = useMemo(() => name && address, [name, address])

	const onTransitionDone = useCallback(() => {
		if (disabled || inactive) {
			return
		}

		dispatch({
			payload: { button: HeaderButtons.prev, state: "enabled" },
			type: DataActionTypes.SetHeaderButtonState,
		})
		dispatch({
			payload: {
				button: HeaderButtons.next,
				state: grantFlow.name && grantFlow.address ? "enabled" : "hidden",
			},
			type: DataActionTypes.SetHeaderButtonState,
		})
	}, [inactive, disabled, dispatch, grantFlow])

	const onSubmit = useCallback(async () => {
		if (disabled || inactive || !isStepValid) {
			return
		}

		await redirect(
			StepID.grantSocialSecurityNumberStep,
			StepID.grantNameAndAddressStep
		)
	}, [disabled, inactive, isStepValid, redirect])

	const onPrev = useCallback(async () => {
		await redirect(StepID.taxResidenceStep, StepID.grantNameAndAddressStep)
	}, [redirect])

	useEffect(() => {
		dispatch({
			type: DataActionTypes.grantNameAndAddressChange,
			payload: {
				name,
				address,
			},
		})
	}, [name, address, dispatch])

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
					value={name}
					placeholder="Name"
					fullWidth
					onChange={(value) => setName(value)}
					style={{ marginBottom: "0" }}
				/>
				<Input
					onInputBlurred={onInputBlurred}
					onInputFocused={onInputFocused}
					disabled={disabled}
					value={address}
					placeholder="Address"
					fullWidth
					onChange={(value) => setAddress(value)}
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
		[address, isStepValid, name]
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
