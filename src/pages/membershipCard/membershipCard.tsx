import { FC, useContext, useCallback, useEffect } from "react"
import { getNetworkType } from "@Utils/getNetworkType"
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
import { useKycDao } from "@Hooks/useKycDao"
import { PageProps } from "../pageProps"
import { Logo } from "@Components/logo/logo"

import { H1, P, Policy } from "@Style/index"
import styled from "styled-components"

const Footer: StepPart = ({ disabled, inactive, onEnter }) => (
	<>
		<Policy>
			By starting verification you accept{" "}
			<a
				target="_blank"
				rel="noreferrer"
				href="https://kycdao.xyz/terms-and-conditions">
				Privacy Policy
			</a>{" "}
			and{" "}
			<a
				target="_blank"
				rel="noreferrer"
				href="https://kycdao.xyz/privacy-policy">
				Terms &#38; Conditions.
			</a>
		</Policy>
		<SubmitButton
			black
			fullWidth
			autoFocus={!inactive && !disabled}
			disabled={disabled}
			inactive={inactive}
			onClick={onEnter}
			label="Join"
		/>
	</>
)

const Ul = styled.ul`
	padding: 1rem 0;
	margin: 0 auto;
	width: fit-content;
`

const Li = styled.li`
	list-style: none;
	display: flex;
	margin-bottom: 2rem;
	align-items: center;
	position: relative;

	&:after {
		display: block;
		content: "";
		height: 100%;
		width: 1px;
		background-color: var(--kyc-sdk-cybergreen);
		position: absolute;
		top: 2rem;
		left: 1rem;
	}

	&:last-child {
		&:after {
			display: none;
		}
	}

	& > div {
		margin-left: 1rem;
		display: flex;
		flex-flow: column;

		${P},
		b {
			font-family: var(--kyc-sdk-primary-font);
			font-weight: 400;
			color: black;
		}

		b {
			font-size: 12px;
			color: black;
		}
	}
`

const Span = styled.span`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 2rem;
	width: 2rem;
	outline: 0.5rem solid var(--kyc-sdk-cybergreen-35);
	border-radius: 999rem;
	background: var(--kyc-sdk-cybergreen);
	color: black;
	font-weight: 800;
`

const ProcessContainer = styled.div`
	display: flex;
	height: 100%;
	align-items: center;
`

const Body = () => {
	return (
		<ProcessContainer>
			<Ul>
				<Li>
					<Span>1</Span>
					<div>
						<P>Connect</P>
						<b>Using your wallet</b>
					</div>
				</Li>
				<Li>
					<Span>2</Span>
					<div>
						<P>Verify</P>
						<b>Log-in or Open a compliant account</b>
					</div>
				</Li>
				<Li>
					<Span>3</Span>
					<div>
						<P>Mint</P>
						<b>kycNFT - $5</b>
					</div>
				</Li>
			</Ul>
		</ProcessContainer>
	)
}

const Header = () => (
	<H1>
		<Logo />
		KycDAO Membership
	</H1>
)

export const KycDAOMembershipStep: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const { dispatch } = useContext(StateContext)

	const kycDaoContext = useKycDao()

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

	const onSubmit = useCallback(async () => {
		if (kycDaoContext) {
			const network = getNetworkType(
				kycDaoContext.kycDao.sdkStatus.availableBlockchainNetworks[0]
			)
			if (network) {
				try {
					await kycDaoContext.kycDao.connectWallet(network)
					await kycDaoContext.kycDao.registerOrLogin()
					dispatch({
						type: DataActionTypes.changePage,
						payload: {
							current: StepID.verificationStep,
							prev: StepID.kycDAOMembershipStep,
						},
					})
					dispatch({ type: DataActionTypes.termsAcceptedChange, payload: true })
				} catch (e) {
					// TODO: nicer error handling for unsupported network https://kycdao.atlassian.net/browse/KYC-505
					let errorMsg =
						"Connecting to your wallet failed, because of an error. Please try again."
					if (e instanceof Error) {
						if (e.message.includes("Connected EVM network is not enabled")) {
							errorMsg = `Please switch your wallet to ${kycDaoContext.kycDao.sdkStatus.availableBlockchainNetworks[0]}`
						} else {
							errorMsg = `${errorMsg} (${e.message})`
						}
					}

					dispatch({
						type: DataActionTypes.SetErrorModalText,
						payload: {
							header: "An error happened",
							body: `${errorMsg}`,
						},
					})
					dispatch({ type: DataActionTypes.setModal, payload: "genericError" })
					if (typeof e === "string" || e instanceof Error) {
						console.error(e)
					} else {
						console.error(JSON.stringify(e))
					}
				}
			}
		}
	}, [dispatch, kycDaoContext])

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
			header={Header}
		/>
	)
}
