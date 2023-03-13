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
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"
import useChangePage from "@Hooks/useChangePage"
import { hexEncodeString } from "@kycdao/kycdao-sdk/dist/blockchains/evm/utils"
import { useKycDao } from "@Hooks/useKycDao"

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

let isSigning = false

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
	const kycDao = useKycDao()
	const [name, setName] = useState<string | undefined>(grantFlow.name)
	const [address, setAddress] = useState<string | undefined>(grantFlow.address)
	const isStepValid: boolean = useMemo(
		() => !!name && !!address,
		[name, address]
	)
	const [hasInteracted, setHasInteracted] = useState(false)
	const [hasSigned, setHasSigned] = useState(false)

	const sign = useCallback(async () => {
		if (isSigning) return

		isSigning = true

		try {
			await window.ethereum.request<string>({
				method: "personal_sign",
				params: [
					hexEncodeString(
						"Grant officers will be able to decrypt and view your data. kycDAO does not have access to this data.",
						{ addPrefix: true }
					),
					kycDao?.kycDao.connectedWallet?.address,
				],
			})

			setHasSigned(true)
		} catch {
			redirect(StepID.taxResidenceStep, StepID.grantNameAndAddressStep, "prev")
		} finally {
			isSigning = false
		}
	}, [kycDao?.kycDao.connectedWallet?.address, redirect])

	useEffect(() => {
		sign()
	}, [sign])

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

	const onSubmit = useCallback(() => {
		if (disabled || inactive || !isStepValid) {
			return
		}

		dispatch({ type: DataActionTypes.GoToNextStep })
	}, [disabled, inactive, isStepValid, dispatch])

	const onPrev = useCallback(() => {
		dispatch({ type: DataActionTypes.GoToPrevStep })
	}, [dispatch])

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
					onChange={(value) => {
						setName(value)
						setHasInteracted(true)
					}}
					style={{ marginBottom: "0" }}
					autoFocus={!isStepValid && !hasInteracted && !inactive}
				/>
				<Input
					disabled={disabled}
					value={address}
					placeholder="Address"
					fullWidth
					onChange={(value) => {
						setAddress(value)
						setHasInteracted(true)
					}}
				/>
				<SubmitButton
					black
					fullWidth
					inactive={inactive}
					disabled={disabled || !isStepValid || !hasSigned}
					onClick={onEnter}
					autoFocus={isStepValid && !hasInteracted && !inactive}
				/>
			</>
		),
		[address, hasInteracted, hasSigned, isStepValid, name]
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
