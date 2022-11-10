import {
	FC,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"
import { KycDaoContext } from "../components/kycDao.provider"
import {
	StateContext,
	DataActionTypes,
	StepID,
	HeaderButtons,
	OnNext,
	OnPrev,
} from "../components/stateContext"
import { Step } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"
import { ToggleButton } from "../components/toggleButton/toggleButton"
import { PageProps } from "./pageProps"

type Chains = "Near" | "Ethereum" | "Solana"

export const ChainSelection: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive,
}) => {
	const kycDao = useContext(KycDaoContext)
	const [connectedWallet, setConnectedWallet] = useState<Chains>()

	const { dispatch } = useContext(StateContext)

	const chains = useMemo<
		{ value: Chains; label: string; isAvailable: boolean }[]
	>(
		() => [
			{
				label: "SOLANA",
				value: "Solana",
				isAvailable: !!kycDao?.sdkStatus.availableBlockchainNetworks.find(
					(bc) => bc.includes("Solana")
				),
			},
			{
				label: "NEAR",
				value: "Near",
				isAvailable: !!kycDao?.sdkStatus.availableBlockchainNetworks.find(
					(bc) => bc.includes("Near")
				),
			},
			{
				label: "EVM",
				value: "Ethereum",
				isAvailable: !!kycDao?.sdkStatus.availableBlockchainNetworks.find(
					(bc) => bc.match(/Ethereum|Polygon/g)
				),
			},
		],
		[kycDao]
	)

	const onChange = useCallback(
		(value: Chains) => async () => {
			kycDao?.kycDao.connectWallet(value).then(() => {
				setConnectedWallet(value)
				dispatch({
					payload: { button: HeaderButtons.next, state: "enabled" },
					type: DataActionTypes.SetHeaderButtonState,
				})
			})
		},
		[]
	)

	const onPrev = useCallback(() => {
		dispatch({
			type: DataActionTypes.changePage,
			payload: {
				current: StepID.taxResidenceStep,
				next: StepID.chainSelection,
			},
		})
	}, [])

	useEffect(() => {
		if (!disabled && !inactive) {
			const next = OnNext.subscribe(onSubmit)

			const prev = OnPrev.subscribe(onPrev)

			return () => {
				next.unsubscribe()
				prev.unsubscribe()
			}
		}
	}, [])

	const onSubmit = useCallback(async () => {
		if (!disabled && connectedWallet) {
			try {
				await kycDao?.kycDao.registerOrLogin()

				const verificationStatus =
					await kycDao?.kycDao.checkVerificationStatus()
				/*if (verificationStatus?.KYC) {
					dispatch({
						type: DataActionTypes.changePage,
						payload: {
							current: StepID.nftArtSelection,
							prev: StepID.chainSelection,
						},
					})
				} else {*/
					dispatch({
						type: DataActionTypes.changePage,
						payload: {
							current: StepID.beginVerificationStep,
							prev: StepID.chainSelection,
						},
					})
				//}
			} catch (err) {
				console.error(err)
			}
		}
	}, [connectedWallet, disabled])

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
	}, [inactive, disabled])

	if (!kycDao) {
		return <>Error</>
	}

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
			header={() => <h1 className="h1">Connect</h1>}
			footer={({ disabled, inactive }) => (
				<SubmitButton
					inactive={inactive}
					autoFocus={!!connectedWallet && !inactive}
					disabled={!connectedWallet || disabled}
					className="full-width blue"
					onClick={onSubmit}
				/>
			)}
			body={() => (
				<>
					<h2 className="h2">
						Your amazing NFT image will be here, but first, please complete KYC
						verification!
					</h2>
					<h2 className="h2">Select Network</h2>
					{chains
						.filter((chain) => chain.isAvailable)
						.map(({ label, value }) => (
							<ToggleButton
								label={label}
								toggle={value === connectedWallet}
								key={value}
								className="full-width blue"
								onClick={onChange(value)}
							/>
						))}
				</>
			)}
		/>
	)
}
