import { FC, useCallback, useContext, useEffect } from "react"
import { KycDaoContext } from "../components/kycDao.provider"
import {
	DataActionTypes,
	HeaderButtons,
	OnNext,
	StateContext,
	StepID,
} from "../components/stateContext"
import { Step, StepPart } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"
import { PageProps } from "./pageProps"

const Header: StepPart = () => <h1 className="h1">KycDAO</h1>

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

	const kycDaoContext = useContext(KycDaoContext)

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

	const body = useCallback(() => {
		return (
			<>
				<p>
					<b>The last proof you need in web3.</b>
					<br />
					<br />
					kycDAO is a web3 native reusable compliance framework.
					<br />
					<br />
					CEXs/Ramps already know your wallet address; kycDAO makes it
					composable.
					<br />
					<br />
					Our proofs allow smart contracts and services to interacting with
					trusted wallets.
					<br />
					<br />
					We use soulbound NFTs to prove your compliant account. Strictly no
					PII!
				</p>
			</>
		)
	}, [])

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
			body={body}
		/>
	)
}
