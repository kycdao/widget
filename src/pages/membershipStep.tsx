import { FC, useContext, useCallback, useEffect } from "react"
import {
	DataActionTypes,
	HeaderButtons,
	OnNext,
	OnPrev,
	StateContext,
	StepID,
} from "../components/stateContext"
import { StepPart, Step } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"
import { PageProps } from "./pageProps"

const Footer: StepPart = ({ disabled, inactive, onEnter }) => (
	<>
		<div className="policy">
			By starting verification you accept <a href="#1">Privacy Policy</a> and{" "}
			<a href="#2">Terms &#38; Conditions.</a>
		</div>
		<SubmitButton
			autoFocus={!inactive && !disabled}
			disabled={disabled}
			inactive={inactive}
			className="full-width blue"
			onClick={onEnter}
		/>
	</>
)

const Body = () => {
	return (
		<>
			<h1 className="h1">01 - KycDAO Membership</h1>
			<p className="p">
				kycDAO is building a trusted web3 ecosystem linked together by verified
				wallets.
			</p>
			<p className="p">
				Once verified and proof is minted on-chain, all kycDAO partner services
				will accept the verification.
			</p>
			<div className="the-process">
				<ul>
					<li>
						<span>1</span>
						<p>Connect</p>
					</li>
					<li>
						<span>2</span>
						<p>Verify</p>
					</li>
					<li>
						<span>3</span>
						<p>Mint</p>
					</li>
				</ul>
			</div>
		</>
	)
}

export const KycDAOMembershipStep: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const { dispatch } = useContext(StateContext)

	const onPrev = useCallback(() => {
		dispatch({
			payload: {
				current: StepID.AgreementStep,
				next: StepID.kycDAOMembershipStep,
			},
			type: DataActionTypes.changePage,
		})
	}, [dispatch])

	useEffect(() => {
		if (!disabled && !inactive) {
			const prev = OnPrev.subscribe(onPrev)
			return prev.unsubscribe.bind(prev)
		}
	}, [disabled, inactive, onPrev])

	const onSubmit = useCallback(() => {
		dispatch({
			type: DataActionTypes.changePage,
			payload: {
				current: StepID.verificationStep,
				prev: StepID.kycDAOMembershipStep,
			},
		})
		dispatch({ type: DataActionTypes.termsAcceptedChange, payload: true })
	}, [dispatch])

	useEffect(() => {
		if (!disabled && !inactive) {
			const next = OnNext.subscribe(onSubmit)
			return next.unsubscribe.bind(next)
		}
	}, [disabled, inactive, onSubmit])

	const onTransitionDone = useCallback(() => {
		if (!disabled && !inactive) {
			dispatch({
				payload: { button: HeaderButtons.prev, state: "enabled" },
				type: DataActionTypes.SetHeaderButtonState,
			})
			dispatch({
				payload: { button: HeaderButtons.next, state: "enabled" },
				type: DataActionTypes.SetHeaderButtonState,
			})
		}
	}, [disabled, inactive, dispatch])

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
			footer={Footer}
			body={Body}
		/>
	)
}
