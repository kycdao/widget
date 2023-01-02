import { Logo } from "@Components/logo/logo"
import { FC, useCallback, useContext, useEffect } from "react"
import {
	DataActionTypes,
	HeaderButtons,
	OnNext,
	StateContext,
	StepID,
} from "@Components/stateContext"
import { Step, StepPart } from "@Components/step/step"
import { SubmitButton } from "@Components/submitButton/submitButton"
import { useKycDao } from "@Hooks/useKycDao"
import { PageProps } from "./pageProps"

const Header: StepPart = () => (
	<h1>
		<Logo />
		KycDAO
	</h1>
)

const Body = () => (
	<p>
		<b>The last proof you need in web3.</b>
		<br />
		<br />
		kycDAO is a web3 native reusable compliance framework.
		<br />
		<br />
		CEXs/Ramps already know your wallet address; kycDAO makes it composable.
		<br />
		<br />
		Our proofs allow smart contracts and services to interacting with trusted
		wallets.
		<br />
		<br />
		We use soulbound NFTs to prove your compliant account. Strictly no PII!
	</p>
)

const Footer: StepPart = ({ inactive, disabled, onEnter }) => (
	<SubmitButton
		autoFocus={!inactive && !disabled}
		disabled={disabled}
		className="full-width black"
		onClick={onEnter}
		inactive={inactive}
		label={"Start"}
	/>
)

export const AgreementStep: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const { dispatch } = useContext(StateContext)

	const kycDaoContext = useKycDao()

	const onSubmit = useCallback(() => {
		dispatch({
			type: DataActionTypes.changePage,
			payload: {
				current: StepID.kycDAOMembershipStep,
				prev: StepID.AgreementStep,
			},
		})
	}, [dispatch])

	const onTransitionDone = useCallback(() => {
		if (!disabled && !inactive) {
			dispatch({
				payload: { button: HeaderButtons.prev, state: "hidden" },
				type: DataActionTypes.SetHeaderButtonState,
			})
			dispatch({
				payload: { button: HeaderButtons.next, state: "enabled" },
				type: DataActionTypes.SetHeaderButtonState,
			})
		}
	}, [disabled, inactive, dispatch])

	useEffect(() => {
		if (!disabled && !inactive) {
			const next = OnNext.subscribe(onSubmit)
			return next.unsubscribe.bind(next)
		}
	}, [disabled, inactive, dispatch, onSubmit])

	if (!kycDaoContext) {
		return <>Something went seriously wrong!</>
	}

	return (
		<Step
			onNext={onSubmit}
			onTransitionDone={onTransitionDone}
			disabled={disabled}
			className={className}
			inactive={inactive}
			animation={animation}
			header={Header}
			onEnter={onSubmit}
			footer={Footer}
			body={Body}
		/>
	)
}
