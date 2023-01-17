/* import {
	FC,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"
import {
	StateContext,
	DataActionTypes,
	StepID,
	HeaderButtons,
	OnNext,
	OnPrev,
} from "@Components/stateContext"
import { Step, StepPart } from "@Components/step/step"
import { SubmitButton } from "@Components/submitButton/submitButton"
import { ToggleButton } from "@Components/toggleButton/toggleButton"
import { useKycDao } from "@Hooks/useKycDao"
import { PageProps } from "./pageProps"
import { H1, H2 } from "@Style/index"

type Chains = "Near" | "Ethereum" | "Solana"

const Header = () => <H1>Connect</H1>

export const ChainSelection: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive,
}) => {
	const kycDao = useKycDao()
	const { dispatch } = useContext(StateContext)

	const [connectedWallet, setConnectedWallet] = useState<Chains | undefined>(
		kycDao?.kycDao.connectedWallet?.blockchain
	)

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
		[dispatch, kycDao?.kycDao]
	)

	const onPrev = useCallback(() => {
		dispatch({
			type: DataActionTypes.changePage,
			payload: {
				current: StepID.taxResidenceStep,
				next: StepID.chainSelection,
			},
		})
	}, [dispatch])

	const onSubmit = useCallback(async () => {
		if (!disabled && connectedWallet) {
			try {
				const verificationStatus =
					await kycDao?.kycDao.checkVerificationStatus()
				if (verificationStatus?.KYC) {
					dispatch({
						type: DataActionTypes.changePage,
						payload: {
							current: StepID.nftArtSelection,
							prev: StepID.chainSelection,
						},
					})
				} else {
					dispatch({
						type: DataActionTypes.changePage,
						payload: {
							current: StepID.beginVerificationStep,
							prev: StepID.chainSelection,
						},
					})
				}
			} catch (err) {
				console.error(err)
			}
		}
	}, [connectedWallet, disabled, kycDao, dispatch])

	useEffect(() => {
		if (!disabled && !inactive) {
			const next = OnNext.subscribe(onSubmit)

			const prev = OnPrev.subscribe(onPrev)

			return () => {
				next.unsubscribe()
				prev.unsubscribe()
			}
		}
	}, [disabled, inactive, onPrev, onSubmit])

	const onTransitionDone = useCallback(() => {
		if (!disabled && !inactive) {
			dispatch({
				payload: { button: HeaderButtons.prev, state: "enabled" },
				type: DataActionTypes.SetHeaderButtonState,
			})
			dispatch({
				payload: {
					button: HeaderButtons.next,
					state: connectedWallet ? "enabled" : "hidden",
				},
				type: DataActionTypes.SetHeaderButtonState,
			})
		}
	}, [inactive, disabled, dispatch, connectedWallet])

	const footer = useCallback<StepPart>(
		({ disabled, inactive, onEnter }) => (
			<SubmitButton
				black
				fullWidth
				inactive={inactive}
				autoFocus={!!connectedWallet && !inactive}
				disabled={!connectedWallet || disabled}
				onClick={onEnter}
			/>
		),
		[connectedWallet]
	)

	const body = useCallback<StepPart>(
		() => (
			<>
				<H2>
					Your amazing NFT image will be here, but first, please complete KYC
					verification!
				</H2>
				<H2>Select Network</H2>
				{chains
					.filter((chain) => chain.isAvailable)
					.map(({ label, value }) => (
						<ToggleButton
							label={label}
							toggled={value === connectedWallet}
							key={value}
							className="full-width blue"
							onClick={onChange(value)}
						/>
					))}
			</>
		),
		[onChange, connectedWallet, chains]
	)

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
			header={Header}
			footer={footer}
			body={body}
		/>
	)
}*/
