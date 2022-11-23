import { useContext, useCallback, FC, useEffect, useState } from "react"
import { Button } from "../components/button/button"
import {
	DataActionTypes,
	HeaderButtons,
	OnNext,
	StateContext,
	StepID,
} from "../components/stateContext"
import { StepPart, Step } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"
import { PageProps } from "./pageProps"

const Body = () => {
	return (
		<>
			<p>
				kycDao offers an annual membership to verified account holders to use
				kycNFTs across the ecosystem.
			</p>
			<p>
				Set the initial length of your membership and mint kycNFTs for free on
				all supported chains.
			</p>
		</>
	)
}

export const MintStep: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const { dispatch } = useContext(StateContext)

	const [yearCount, setYearCount] = useState(0)

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
	}, [disabled, inactive, onSubmit])

	const increase = useCallback(
		() => setYearCount((prevValue) => ++prevValue),
		[]
	)
	const decrease = useCallback(
		() =>
			setYearCount((prevValue) => (prevValue > 0 ? --prevValue : prevValue)),
		[]
	)

	const footer = useCallback<StepPart>(
		({ disabled, inactive, onEnter }) => (
			<>
				<p>Membership period:</p>
				<div style={{ display: "flex", justifyContent: "space-around" }}>
					<Button className="centered clean square" onClick={decrease}>
						<i className="material-icons"> remove </i>
					</Button>
					<div style={{ display: "flex", alignItems: "center" }}>
						{yearCount}
					</div>
					<Button className="centered clean square" onClick={increase}>
						<i className="material-icons"> add </i>
					</Button>
				</div>
				<div className="policy">
					<strong>5,6 Matic</strong> - <strong>0.12 Matic</strong> gas =
					<strong>-5.72 Matic</strong> ($12.94USD)
				</div>
				<SubmitButton
					autoFocus={!inactive && !disabled}
					disabled={disabled}
					className="full-width blue"
					onClick={onEnter}
					inactive={inactive}
				/>
			</>
		),
		[decrease, increase, yearCount]
	)

	return (
		<Step
			onNext={onSubmit}
			onTransitionDone={onTransitionDone}
			disabled={disabled}
			className={className}
			inactive={inactive}
			animation={animation}
			header={() => <h1 className="h1">Mint membership</h1>}
			onEnter={onSubmit}
			footer={footer}
			body={Body}
		/>
	)
}
