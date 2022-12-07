import { Countries } from "@kycdao/kycdao-sdk"
import {
	useState,
	useContext,
	useCallback,
	useMemo,
	useEffect,
	FC,
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
import { useKycDao } from "../hooks/useKycDao"
import { PageProps } from "./pageProps"

export const Body = () => {
	return (
		<>
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
				Tax residence
			</h1>
			<p className="p">
				Please select the country where you are currently a tax residence.
			</p>
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
	const kycDao = useKycDao()

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
		if (!disabled && !submitDisabled && !inactive) {
			dispatch({
				type: DataActionTypes.taxResidenceChange,
				payload: taxResidence.current,
			})

			try {
				const verificationStatus =
					await kycDao?.kycDao.checkVerificationStatus()
				if (verificationStatus?.KYC) {
					dispatch({
						type: DataActionTypes.changePage,
						payload: {
							current: StepID.nftArtSelection,
							prev: StepID.taxResidenceStep,
						},
					})
				} else {
					dispatch({
						type: DataActionTypes.changePage,
						payload: {
							current: StepID.beginVerificationStep,
							prev: StepID.taxResidenceStep,
						},
					})
				}
			} catch (err) {
				console.error(err)
			}
		}
	}, [taxResidence, submitDisabled, inactive, dispatch, disabled, kycDao])

	const onPrev = useCallback(() => {
		dispatch({
			payload: {
				current: StepID.emailDiscordVerificationStep,
				next: StepID.taxResidenceStep,
			},
			type: DataActionTypes.changePage,
		})
		dispatch({
			payload: taxResidence.current,
			type: DataActionTypes.taxResidenceChange,
		})
	}, [dispatch])

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
					className="full-width"
					onChange={onChange}
				/>
				<SubmitButton
					inactive={inactive}
					autoFocus={!submitDisabled && !inactive}
					disabled={submitDisabled || disabled}
					className="full-width black"
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
