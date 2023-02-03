import { Countries } from "@kycdao/kycdao-sdk"

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
import {
	FC,
	useState,
	useContext,
	useMemo,
	useRef,
	useEffect,
	useCallback,
} from "react"
import useChangePage from "@Hooks/useChangePage"

const Body = () => {
	return (
		<>
			<H1>
				<Logo />
				Tax residence
			</H1>
			<P>Please select the country where you are currently a tax residence.</P>
		</>
	)
}

export const TaxResidenceStep: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const [value, setValue] = useState<string>()
	const {
		dispatch,
		data: { taxResidency },
	} = useContext(StateContext)
	const submitDisabled = useMemo(
		() => !Countries.find((c) => c.name === value),
		[value]
	)
	const taxResidence = useRef(taxResidency)
	const inputValue = useRef(null)
	const redirect = useChangePage()
	const kycDaoContext = useContext(KycDaoContext)

	useEffect(() => {
		if (taxResidency) {
			setValue(
				Countries.find((country) => country.iso_cca2 === taxResidency)?.name ||
					""
			)
		}
	}, [taxResidency])

	const onTransitionDone = useCallback(() => {
		if (!disabled && !inactive) {
			dispatch({
				payload: { button: HeaderButtons.prev, state: "enabled" },
				type: DataActionTypes.SetHeaderButtonState,
			})
			dispatch({
				payload: {
					button: HeaderButtons.next,
					state: taxResidency ? "enabled" : "hidden",
				},
				type: DataActionTypes.SetHeaderButtonState,
			})
		}
	}, [inactive, disabled, dispatch, taxResidency])

	const onSubmit = useCallback(async () => {
		if (disabled || inactive || submitDisabled) {
			return
		}

		dispatch({
			payload: taxResidence.current,
			type: DataActionTypes.taxResidenceChange,
		})

		if (kycDaoContext?.grantFlowEnabled) {
			// todo: check country is US
			await redirect(StepID.grantNameAndAddressStep, StepID.taxResidenceStep)
		} else {
			await redirect(StepID.beginVerificationStep, StepID.taxResidenceStep)
		}
	}, [
		disabled,
		inactive,
		submitDisabled,
		kycDaoContext?.grantFlowEnabled,
		redirect,
	])

	const onPrev = useCallback(async () => {
		await redirect(StepID.emailDiscordVerificationStep, StepID.taxResidenceStep)
		dispatch({
			payload: taxResidence.current,
			type: DataActionTypes.taxResidenceChange,
		})
	}, [dispatch, redirect])

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

	const autoCompleteData = useMemo(() => Countries.map((c) => c.name), [])

	const onChange = useCallback((newValue: string) => {
		taxResidence.current =
			Countries.find((country) => country.name === newValue)?.iso_cca2 || ""
		setValue(newValue)
	}, [])

	useEffect(() => {
		if (!disabled && !inactive) {
			dispatch({
				type: DataActionTypes.SetHeaderButtonState,
				payload: {
					button: HeaderButtons.next,
					state: submitDisabled ? "hidden" : "enabled",
				},
			})
		}
	}, [submitDisabled, disabled, inactive, dispatch])

	const footer = useCallback<StepPart>(
		({ disabled, inactive, onEnter, onInputBlurred, onInputFocused }) => (
			<>
				<Input
					onInputBlurred={onInputBlurred}
					onInputFocused={onInputFocused}
					inputRef={inputValue}
					autoFocus={submitDisabled && !inactive}
					disabled={disabled}
					autoCompleteData={autoCompleteData}
					value={value}
					placeholder={"Type your tax residence here"}
					fullWidth
					onChange={onChange}
				/>
				<SubmitButton
					black
					fullWidth
					inactive={inactive}
					autoFocus={!submitDisabled && !inactive}
					disabled={submitDisabled || disabled}
					onClick={onEnter}
				/>
			</>
		),
		[submitDisabled, inputValue, autoCompleteData, value, onChange]
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
