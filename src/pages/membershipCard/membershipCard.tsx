import { FC, useContext, useCallback, useEffect } from "react"
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
			className="full-width black"
			onClick={onEnter}
			label="Join"
		/>
	</>
)

const Body = () => {
	return (
		<>
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
						<div>
							<p>Connect</p>
							<b>Using your wallet</b>
						</div>
					</li>
					<li>
						<span>2</span>
						<div>
							<p>Verify</p>
							<b>Log-in or Open a compliant account</b>
						</div>
					</li>
					<li>
						<span>3</span>
						<div>
							<p>Mint</p>
							<b>kycNFT - $5</b>
						</div>
					</li>
				</ul>
			</div>
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
		KycDAO Membership
	</h1>
)

const getNetworkType = (
	network: string
): "Solana" | "Ethereum" | "Near" | undefined => {
	const test = network.match("(Solana|Ethereum|Near)")?.[0]

	if (!test) {
		switch (network) {
			case "PolygonMainnet":
			case "PolygonMumbai":
				return "Ethereum"
		}
	}

	if (test !== "Solana" && test !== "Near" && test !== "Ethereum") {
		return
	}

	return test
}

export const KycDAOMembershipStep: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const { dispatch } = useContext(StateContext)

	const kycDaoContext = useContext(KycDaoContext)

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
					alert(e)
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
