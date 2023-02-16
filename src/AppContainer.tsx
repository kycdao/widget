import { AppStyleContainer } from "@Components/appStyleContainer"
import {
	KycDao,
	KycDaoInitializationResult,
	SdkConfiguration,
} from "@kycdao/kycdao-sdk"
import { getNetworkType } from "@Utils/getNetworkType"
import { KycDaoClientMessageBody } from "KycDaoClientCommon"
import {
	useMemo,
	useEffect,
	useReducer,
	useState,
	StrictMode,
	useImperativeHandle,
	ForwardRefRenderFunction,
	forwardRef,
} from "react"
import {
	DataActionTypes,
	DefaultData,
	Header,
	HeaderButtons,
	KycDaoContext,
	ModalRouter,
	OnClose,
	reducer,
	StateContext,
	StepID,
} from "./components"
import { Router } from "./pages"

export type AppContainerProps = {
	config: SdkConfiguration
	iframeOptions?: { messageTargetOrigin: string }
	isModal: boolean
	grantFlowEnabled?: boolean
	height?: string | number
	width?: string | number
	onReady?: (kycDaoSdkInstance: KycDaoInitializationResult) => void
}

export type AppContainerRef = {
	kycDaoSdkInstance: KycDaoInitializationResult | undefined
}

const AppContainerRender: ForwardRefRenderFunction<
	AppContainerRef,
	AppContainerProps
> = function AppContainer(
	{ config, isModal, iframeOptions, onReady }: AppContainerProps,
	ref
) {
	const [data, dispatch] = useReducer(reducer, DefaultData)
	const contextData = useMemo(() => ({ data, dispatch }), [data, dispatch])
	const [kycDao, setKycDao] = useState<KycDaoInitializationResult>()

	useImperativeHandle(ref, () => ({
		get kycDaoSdkInstance() {
			return kycDao
		},
	}))

	useEffect(() => {
		if (kycDao) {
			;(async () => {
				try {
					const messageTargetOrigin =
						iframeOptions?.messageTargetOrigin || window.location.origin

					dispatch({
						payload: messageTargetOrigin,
						type: DataActionTypes.setMessageTargetOrigin,
					})

					await kycDao.kycDao.connectWallet(
						getNetworkType(config.enabledBlockchainNetworks[0])
					)
					await kycDao.kycDao.registerOrLogin()

					dispatch({
						type: DataActionTypes.setModalMode,
						payload: isModal,
					})

					if (
						kycDao.kycDao.connectedWallet?.blockchain === "Near" &&
						(await kycDao.kycDao.hasValidNft("KYC")) /* ||
							(await kycDao.kycDao.hasValidNft("AccreditedInvestor"))*/
					) {
						window.parent.postMessage(
							{
								type: "kycDaoSuccess",
								data: "Already has an nft on near.",
							} as KycDaoClientMessageBody,
							messageTargetOrigin
						)

						return
					}

					let startPage
					if (kycDao.redirectEvent) {
						switch (kycDao.redirectEvent) {
							case "NearLogin":
								startPage = StepID.verificationStep
								dispatch({
									type: DataActionTypes.termsAcceptedChange,
									payload: true,
								})
								break
							case "NearUserRejectedError":
								startPage = StepID.nftArtSelection
								dispatch({
									type: DataActionTypes.termsAcceptedChange,
									payload: true,
								})
								break
							case "NearMint":
								startPage = StepID.finalStep
								if (kycDao.transactionUrl) {
									dispatch({
										type: DataActionTypes.setChainExplorerUrl,
										payload: kycDao.transactionUrl,
									})
								}
						}
					} else {
						const { subscribed } = kycDao.kycDao

						startPage = subscribed
							? StepID.subscribedStartStep
							: StepID.AgreementStep
					}

					dispatch({
						payload: { current: startPage, prev: StepID.loading },
						type: DataActionTypes.changePage,
					})

					if (!isModal) {
						dispatch({
							type: DataActionTypes.SetHeaderButtonState,
							payload: { button: HeaderButtons.close, state: "hidden" },
						})
					}
				} catch (err) {
					dispatch({
						type: DataActionTypes.SetErrorModalText,
						payload: {
							header: "An error happened",
							body: `${err}`,
						},
					})
					dispatch({
						type: DataActionTypes.setModal,
						payload: "genericError",
					})
					console.error(err)
				}
			})()
		}
	}, [kycDao, iframeOptions, isModal, config.enabledBlockchainNetworks])

	useEffect(() => {
		KycDao.initialize(config)
			.then((result) => {
				setKycDao(result)

				if (onReady) {
					onReady(result)
				}
			})
			.catch(() => {
				dispatch({
					type: DataActionTypes.changePage,
					payload: { current: StepID.fatalError, prev: StepID.loading },
				})
			})
	}, [config, onReady])

	useEffect(() => {
		if (isModal) {
			const close = OnClose.subscribe(() => {
				if (data.currentPage === StepID.finalStep) {
					window.parent.postMessage(
						{
							type: "kycDaoSuccess",
							data: data.chainExplorerUrl,
						} as KycDaoClientMessageBody,
						data.messageTargetOrigin
					)
				} else {
					window.parent.postMessage(
						{ type: "kycDaoCloseModal" } as KycDaoClientMessageBody,
						data.messageTargetOrigin
					)
				}
			})
			return close.unsubscribe.bind(close)
		}
	}, [data, isModal])

	if (!kycDao) {
		return (
			<StrictMode>
				<AppStyleContainer>
					<StateContext.Provider value={contextData}>
						<Router />
					</StateContext.Provider>
				</AppStyleContainer>
			</StrictMode>
		)
	}

	return (
		<StrictMode>
			<AppStyleContainer>
				<KycDaoContext.Provider value={kycDao}>
					<StateContext.Provider value={contextData}>
						<Header />
						<Router />
						<ModalRouter />
					</StateContext.Provider>
				</KycDaoContext.Provider>
			</AppStyleContainer>
		</StrictMode>
	)
}

export const AppContainer = forwardRef(AppContainerRender)
