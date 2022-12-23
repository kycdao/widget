import { useContext, useCallback, FC, useEffect, useState } from "react"
import { Button } from "@Components/button/button"
import {
	DataActionTypes,
	HeaderButtons,
	OnNext,
	OnPrev,
	StateContext,
	StepID,
} from "@Components/stateContext"
import { StepPart, Step } from "@Components/step/step"
import { SubmitButton } from "@Components/submitButton/submitButton"
import { PageProps } from "../pageProps"
import { useKycDao } from "@Hooks/useKycDao"
import { useMinting } from "@Hooks/useMinting"
import { Logo } from "@Components/logo/logo"

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
		<Logo />
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
		data: { imageId },
	} = useContext(StateContext)
	const kycDao = useKycDao()

	const [yearCount, setYearCount] = useState<number | null>(null)

	const minting = useMinting()

	const onSubmit = useCallback(async () => {
		if (kycDao && yearCount && yearCount > 0 && imageId) {
			dispatch({
				payload: yearCount,
				type: DataActionTypes.subscriptionYearsChange,
			})
			minting(imageId, yearCount)
		}
	}, [kycDao, yearCount, minting, dispatch, imageId])

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

	/*const price = useMemo(() => {
		return 5 * (yearCount || 0)
	}, [yearCount])*/

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
								disabled={disabled}
								className="centered clean square calculator-button"
								onClick={decrease}>
								<i style={{ lineHeight: "2em" }} className="material-icons">
									remove
								</i>
							</Button>
							<div className="yearCount">{yearCount} year</div>
							<Button
								disabled={disabled}
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
				<div style={{ display: "none" }} className="value">
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
					label={"Pay + mint"}
				/>
			</>
		),
		[decrease, increase, yearCount]
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
