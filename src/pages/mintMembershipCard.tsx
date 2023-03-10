import { FC, useCallback, useContext, useEffect, useState } from "react"

import { PageProps } from "./pageProps"
import { useKycDao } from "@Hooks/useKycDao"
import { useMinting } from "@Hooks/useMinting"

import styled from "styled-components/macro"
import {
	Button,
	Centered,
	DataActionTypes,
	H1,
	HeaderButtons,
	Logo,
	OnNext,
	OnPrev,
	P,
	StateContext,
	Step,
	StepPart,
	SubmitButton,
	bold,
	smallText,
	text,
} from "@Components/index"
import useErrorHandler from "@Hooks/useErrorHandler"

const Body = () => {
	return (
		<>
			<P>
				kycDao offers an annual membership to verified account holders to use
				kycNFTs across the ecosystem.
			</P>
			<P>
				Set the initial length of your membership and mint kycNFTs for free on
				all supported chains.
			</P>
		</>
	)
}

const Header = () => (
	<H1>
		<Logo />
		Mint membership
	</H1>
)

const unstyledButtonIcon = ({
	children,
}: {
	children: JSX.Element | string
}) => <i className="material-icons">{children}</i>

const ButtonIcon = styled(unstyledButtonIcon)`
	line-height: 2em;
`

const CalculatorWrapper = styled.div`
	align-items: center;

	p {
		font-family: var(--kyc-sdk-primary-font);
	}
`

const Calculator = styled.div`
	display: flex;
	flex-flow: column;
	flex-direction: column;

	& > div {
		justify-content: space-evenly;
		flex-direction: row;
		display: flex;
		margin-bottom: 1em;
	}
`

const CalculatorButton = styled(Button)`
	margin-block: auto;
	line-height: 2em;
	justify-content: center;
	padding-left: 0;
	padding-right: 0;
	width: 3em;
	height: 3em;

	//background: rgb(0, 0, 0, 0);
	background: black;
	border: 2px black solid;

	span {
		color: white;

		i {
			vertical-align: middle;
		}
	}

	&:hover {
		box-shadow: 0 0 0 0px var(--kyc-sdk-cybergreen-35);
		background: var(--kyc-sdk-cybergreen);

		span {
			color: black;
		}

		&:focus {
			span {
				color: black;
			}
		}
	}

	&:focus {
		box-shadow: 0 0 0 5px var(--kyc-sdk-cybergreen-35);

		span {
			color: white;
		}
	}

	&:active {
		background: var(--kyc-sdk-cybergreen);
		border: 2px solid var(--kyc-sdk-cybergreen);
		box-shadow: 0 0 0 5px var(--kyc-sdk-cybergreen-35);
	}

	&:focus-visible {
		outline: none;
		border: none;
	}
`

const CalculatorBody = styled.div`
	align-items: center;
	justify-content: center;
`

const Sum = styled.div`
	display: flex;
	align-items: center;
	flex: 1;
	justify-content: center;
`

const Price = styled.span`
	${text}
	${bold}
`

const PriceWithStrikethrough = styled(Price)`
	text-decoration: line-through;
	font-weight: 500;
	margin-left: 0.5rem;
`

const Value = styled.div`
	${smallText}
	display: flex;
	margin-bottom: 1em;

	padding: 0.5rem;
	background: var(--kyc-sdk-cybergreen-35);
	border-radius: 4px;
	align-items: center;

	i {
		margin-left: -2px;
		margin-right: 2px;
	}

	p {
		${smallText}
		display: flex;
		padding-right: 3px;

		> strong {
			${bold}
			padding-right: 3px;
		}
	}
`

const YearCount = styled.div`
	${Centered}
	${text}
	padding: 1rem;
	width: 10rem;
	display: flex;
	align-items: center;
	margin-block: auto;
	flex: 1;
	justify-content: center;
`

const calculateMembershipCost = (years: number): number => {
	// If the user buys for 1 year, the price is 0.
	if (years === 1) {
		return 0
	}

	// A membership costs $5 per year, but the first year is free.
	const costPerYear = 5
	const freeYear = 1
	const remainingYears = years - freeYear

	return costPerYear * remainingYears
}

const calculateOriginalMembershipCost = (years: number): number => years * 5

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

	const [yearCount, setYearCount] = useState<number>(1)

	const minting = useMinting()

	const handleError = useErrorHandler()

	const onSubmit = useCallback(async () => {
		if (kycDao && yearCount && yearCount > 0 && imageId) {
			dispatch({
				payload: yearCount,
				type: DataActionTypes.subscriptionYearsChange,
			})
			try {
				await minting(imageId, yearCount)
			} catch (error) {
				handleError("minting", error)
			}
		}
	}, [kycDao, yearCount, minting, dispatch, imageId, handleError])

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
				return 1
			}

			return prevValue
		})
	}, [])

	const onPrev = useCallback(() => {
		dispatch({ type: DataActionTypes.GoToPrevStep })
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
				<CalculatorWrapper>
					<P>Membership period:</P>
					<Calculator>
						<CalculatorBody>
							<CalculatorButton
								mode="clean"
								disabled={disabled || yearCount === null || yearCount === 1}
								className="square"
								onClick={decrease}>
								<ButtonIcon>remove</ButtonIcon>
							</CalculatorButton>
							<YearCount>{yearCount} year</YearCount>
							<CalculatorButton
								mode="clean"
								disabled={disabled}
								className="square"
								onClick={increase}>
								<ButtonIcon>add</ButtonIcon>
							</CalculatorButton>
							<Sum>
								<Price>${calculateMembershipCost(yearCount)}</Price>
								<PriceWithStrikethrough>
									${calculateOriginalMembershipCost(yearCount)}
								</PriceWithStrikethrough>
								{/*<span className="subscription"> / year</span>*/}
							</Sum>
						</CalculatorBody>
					</Calculator>
				</CalculatorWrapper>
				{false && (
					<Value>
						<i className="material-icons">info</i>
						<P>
							<strong>5,6</strong> Matic
						</P>
						<P>
							- <strong>0.12</strong> Matic{" "}
						</P>
						<P>
							{" "}
							gas = <strong>-5.72</strong> Matic ($12.94USD)
						</P>
					</Value>
				)}
				<SubmitButton
					black
					fullWidth
					autoFocus={!inactive && !disabled && !yearCount}
					disabled={disabled || !yearCount || yearCount === 0}
					onClick={onEnter}
					inactive={inactive}
					label={"Pay + mint"}
					label2={"Pay + mint"}
				/>
			</>
		),
		[decrease, increase, yearCount]
	)

	if (!kycDao) {
		return <H1>Error</H1>
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
