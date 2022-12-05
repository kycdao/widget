import { useContext, useCallback, FC, useEffect, useState } from "react"
import { Button } from "../../components/button/button"
import { KycDaoContext } from "../../components/kycDao.provider"
import {
	DataActionTypes,
	HeaderButtons,
	OnNext,
	OnPrev,
	StateContext,
	StepID,
} from "../../components/stateContext"
import { StepPart, Step } from "../../components/step/step"
import { SubmitButton } from "../../components/submitButton/submitButton"
import { PageProps } from "../pageProps"
import "./mintMembershipCard.scss"
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

const Header = () => (
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
		Mint membership
	</h1>
)

export const MintStep: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const {
		dispatch,
		data: { termsAccepted, imageId },
	} = useContext(StateContext)
	const kycDao = useContext(KycDaoContext)

	const [yearCount, setYearCount] = useState<number | null>(null)

	const onSubmit = useCallback(async () => {
		if (kycDao && yearCount && yearCount > 0) {
			try {
				dispatch({
					type: DataActionTypes.changePage,
					payload: { current: StepID.loading, prev: StepID.mintStep },
				})
				try {
					await kycDao.kycDao.startMinting({
						disclaimerAccepted: termsAccepted,
						verificationType: VerificationTypes.KYC,
						imageId,
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
	}, [dispatch, kycDao, termsAccepted, imageId, yearCount])

	const onTransitionDone = useCallback(() => {
		if (!disabled && !inactive) {
			dispatch({
				payload: { button: HeaderButtons.prev, state: "enabled" },
				type: DataActionTypes.SetHeaderButtonState,
			})
			dispatch({
				payload: { button: HeaderButtons.next, state: "hidden" },
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

	useEffect(() => {
		if (!disabled && !inactive && yearCount && yearCount > 0) {
			dispatch({
				payload: { button: HeaderButtons.next, state: "enabled" },
				type: DataActionTypes.SetHeaderButtonState,
			})
		}
		if (disabled || inactive || yearCount === null) {
			dispatch({
				payload: { button: HeaderButtons.next, state: "hidden" },
				type: DataActionTypes.SetHeaderButtonState,
			})
		}
	}, [disabled, inactive, yearCount, dispatch])

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
				<div className="calculator-wrapper">
					<p className="p">Membership period:</p>
					<div
						className="calculator"
						style={{ display: "flex", flexDirection: "column" }}>
						<div>
							<Button
								className="centered clean square calculator-button"
								onClick={decrease}>
								<i style={{ lineHeight: "2em" }} className="material-icons">
									remove
								</i>
							</Button>
							<div className="yearCount">{yearCount} year</div>
							<Button
								className="centered clean square calculator-button"
								onClick={increase}>
								<i style={{ lineHeight: "2em" }} className="material-icons">
									add
								</i>
							</Button>
							<div className="sum">
								<span className="price">${5 * (yearCount || 0)}</span>
								{/*<span className="subscription"> / year</span>*/}
							</div>
						</div>
					</div>
				</div>
				<div className="value">
					<i className="material-icons">info</i>
					<p>
						<strong>5,6</strong> Matic
					</p>
					<p>
						- <strong>0.12</strong> Matic{" "}
					</p>
					<p>
						{" "}
						gas = <strong>-5.72</strong> Matic ($12.94USD)
					</p>
				</div>
				<SubmitButton
					autoFocus={!inactive && !disabled && !yearCount}
					disabled={disabled || !yearCount}
					className="full-width black"
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
