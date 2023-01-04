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

const Footer: StepPart = ({ disabled, inactive, onEnter }) => (
	<>
		<div className="policy">
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
			{/*<p className="p">*/}
			{/*	kycDAO is building a trusted web3 ecosystem linked together by verified*/}
			{/*	wallets.*/}
			{/*</p>*/}
			{/*<p className="p">*/}
			{/*	Once verified and proof is minted on-chain, all kycDAO partner services*/}
			{/*	will accept the verification.*/}
			{/*</p>*/}

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
		<Logo />
		KycDAO Membership
	</h1>
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
