import { useContext, useCallback, FC, useEffect, useState } from "react"
import { Button } from "../components/button/button"
import { KycDaoContext } from "../components/kycDao.provider"
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
import "./mintMembershipStep.scss"
import { VerificationTypes } from "@kycdao/kycdao-sdk"

const Body = () => {
	return (
		<>
			<p className="p">
				kycDao offers an annual membership to verified account holders to use
				kycNFTs across the ecosystem.
			</p>
			<p className="p">
				Set the initial length of your membership and mint kycNFTs for free on
				all supported chains.
			</p>
		</>
	)
}

const Header = () => <h1 className="h1">Mint membership</h1>

export const MintStep: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const {
		dispatch,
		data: { termsAccepted },
	} = useContext(StateContext)
	const kycDao = useContext(KycDaoContext)

	const [yearCount, setYearCount] = useState<number | null>(null)

	const onSubmit = useCallback(async () => {
		if (kycDao) {
			try {
				dispatch({
					type: DataActionTypes.changePage,
					payload: { current: StepID.loading, prev: StepID.mintStep },
				})
				try {
					await kycDao.kycDao.startMinting({
						disclaimerAccepted: termsAccepted,
						verificationType: VerificationTypes.KYC,
					})
					dispatch({
						type: DataActionTypes.changePage,
						payload: { current: StepID.finalStep, prev: StepID.loading },
					})
				} catch (error) {
					dispatch({
						type: DataActionTypes.changePage,
						payload: { current: StepID.mintStep, prev: StepID.loading },
					})
					console.error(error)
					alert(error)
				}
			} catch (e: unknown) {
				if (typeof e === "object") {
					const f = e as Record<string, unknown>
					if (f.code && f.code === 4001) {
						dispatch({
							type: DataActionTypes.changePage,
							payload: {
								current: StepID.mintStep,
								prev: StepID.loading,
							},
						})
					}
				}
			}
		}
	}, [dispatch, kycDao, termsAccepted])

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

	useEffect(() => {
		if (!disabled && !inactive) {
			const next = OnNext.subscribe(onSubmit)
			return next.unsubscribe.bind(next)
		}
	}, [disabled, inactive, onSubmit])

	const increase = useCallback(() => {
		setYearCount((prevValue) => (prevValue ? ++prevValue : 1))
	}, [])

	const decrease = useCallback(() => {
		setYearCount((prevValue) => {
			if (prevValue) {
				if (prevValue > 1) {
					return --prevValue
				}
				return null
			}

			return prevValue
		})
	}, [])

	const onPrev = useCallback(() => {
		dispatch({
			type: DataActionTypes.changePage,
			payload: {
				current: StepID.nftArtSelection,
				next: StepID.mintStep,
			},
		})
	}, [dispatch])

	useEffect(() => {
		if (!disabled && !inactive) {
			const prev = OnPrev.subscribe(onPrev)

			return () => {
				prev.unsubscribe()
			}
		}
	}, [disabled, inactive, onPrev])

	const footer = useCallback<StepPart>(
		({ disabled, inactive, onEnter }) => (
			<>
				<p className="p">Membership period:</p>
				<div>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<div
							style={{
								justifyContent: "space-evenly",
								flexDirection: "row",
								display: "flex",
								marginBottom: "2em",
							}}>
							<Button
								style={{ marginBlock: "auto" }}
								className="centered clean square"
								onClick={decrease}>
								<i style={{ lineHeight: "2em" }} className="material-icons">
									remove
								</i>
							</Button>
							<div
								className="yearCount"
								style={{
									display: "flex",
									alignItems: "center",
									marginBlock: "auto",
									flex: 1,
									justifyContent: "center",
								}}>
								{yearCount} year
							</div>
							<Button
								style={{ lineHeight: "2em", marginBlock: "auto" }}
								className="centered clean square"
								onClick={increase}>
								<i style={{ lineHeight: "2em" }} className="material-icons">
									add
								</i>
							</Button>
							<div
								style={{
									flexDirection: "column",
									marginBlock: "auto",
									flex: 1,
									justifyContent: "center",
									marginLeft: "1em",
								}}>
								<span className="price">${5 * (yearCount || 0)}</span>
								<span className="subscription"> / year</span>
							</div>
						</div>
					</div>
				</div>
				<div className="value">
					<strong>5,6 Matic</strong> - <strong>0.12 Matic</strong> gas =
					<strong>-5.72 Matic</strong> ($12.94USD)
				</div>
				<SubmitButton
					autoFocus={!inactive && !disabled && !yearCount}
					disabled={disabled || !yearCount}
					className="full-width blue"
					onClick={onEnter}
					inactive={inactive}
					label={`Pay + mint on ${kycDao?.kycDao.connectedWallet?.blockchain}`}
				/>
			</>
		),
		[decrease, increase, yearCount, kycDao]
	)

	if (!kycDao) {
		return <>Error</>
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
			footer={footer}
			body={Body}
		/>
	)
}
