import { AppStyleContainer } from "@Components/appStyleContainer"
import { errorHandler } from "@Hooks/errorHandler"
import {
	KycDao,
	KycDaoInitializationResult,
	SdkConfiguration,
} from "@kycdao/kycdao-sdk"
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
} from "./components"
import { Router } from "./pages"
import { getNetworkType } from "@Utils/getNetworkType"

export type AppContainerProps = {
	config: SdkConfiguration
	iframeOptions?: { messageTargetOrigin: string }
	isModal: boolean
	grantFlowEnabled?: boolean
	height?: string | number
	width?: string | number
	messageTargetOrigin: string
	onReady?: (kycDaoSdkInstance: KycDaoInitializationResult) => void
}

export type AppContainerRef = {
	kycDaoSdkInstance: KycDaoInitializationResult | undefined
}

const AppContainerRender: ForwardRefRenderFunction<
	AppContainerRef,
	AppContainerProps
> = function AppContainer(
	{
		config,
		isModal,
		iframeOptions,
		onReady,
		messageTargetOrigin,
	}: AppContainerProps,
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
		dispatch({
			payload: messageTargetOrigin,
			type: DataActionTypes.setMessageTargetOrigin,
		})
	}, [dispatch, messageTargetOrigin])

	useEffect(() => {
		if (kycDao) {
			;(async () => {
				try {
					dispatch({
						type: DataActionTypes.SetLoadingMessage,
						payload:
							"Trying to connet your wallet. If it does not succeed please ask for help on our Discord.",
					})

					dispatch({
						type: DataActionTypes.setModalMode,
						payload: isModal,
					})

					const modalTimeout = setTimeout(() => {
						dispatch({
							type: DataActionTypes.ShowModal,
							payload: {
								body: "If it seems stuck, please click to retry.",
								header: "Trying to connect your wallet",
								type: "genericInfo",
								showRetry: true,
							},
						})
					}, 5000)

					await kycDao.kycDao.connectWallet(
						getNetworkType(config.enabledBlockchainNetworks[0])
					)

					dispatch({
						type: DataActionTypes.SetLoadingMessage,
						payload: "",
					})

					dispatch({
						type: DataActionTypes.HideModal,
					})

					clearTimeout(modalTimeout)

					const emailData = await kycDao?.kycDao.checkEmailConfirmed()

					dispatch({
						type: DataActionTypes.setEmailConfirmed,
						payload: !!emailData.isConfirmed,
					})

					if (emailData.address) {
						dispatch({
							type: DataActionTypes.emailChange,
							payload: emailData.address,
						})
					}

					const hasValidNft = await kycDao.kycDao.hasValidNft("KYC")

					if (hasValidNft && kycDao.redirectEvent !== "NearMint") {
						dispatch({
							payload: true,
							type: DataActionTypes.SetProcessSucess,
						})

						dispatch({
							payload: true,
							type: DataActionTypes.SetAlreadyHaveAnNftOnThisChain,
						})

						dispatch({ type: DataActionTypes.GoToNextStep })

						return
					}

					if (kycDao.redirectEvent) {
						dispatch({
							type: DataActionTypes.termsAcceptedChange,
							payload: true,
						})

						switch (kycDao.redirectEvent) {
							case "NearLogin":
								break
							case "NearUserRejectedError":
								window.parent.postMessage(
									{
										type: "kycDaoCloseModal",
									} as KycDaoClientMessageBody,
									messageTargetOrigin
								)
								return
							case "NearMint":
								dispatch({
									type: DataActionTypes.SetNearMinted,
									payload: true,
								})

								if (kycDao.mintingResult?.transactionUrl) {
									dispatch({
										type: DataActionTypes.setChainExplorerUrl,
										payload: kycDao.mintingResult?.transactionUrl || "",
									})
								}
								if (kycDao.mintingResult?.imageUrl) {
									dispatch({
										type: DataActionTypes.setNftImageUrl,
										payload: kycDao.mintingResult?.imageUrl,
									})
								}
						}
					} else {
						await kycDao.kycDao.registerOrLogin()
						const { subscribed } = kycDao.kycDao

						if (subscribed) {
							dispatch({
								payload: true,
								type: DataActionTypes.SetReturnUserFlow,
							})
						}
					}

					if (!isModal) {
						dispatch({
							type: DataActionTypes.SetHeaderButtonState,
							payload: { button: HeaderButtons.close, state: "hidden" },
						})
					}
				} catch (error) {
					errorHandler("fatal", error, dispatch, messageTargetOrigin)
				}

				dispatch({ type: DataActionTypes.StartFlow })
			})()
		}
	}, [
		kycDao,
		iframeOptions,
		isModal,
		config.enabledBlockchainNetworks,
		messageTargetOrigin,
	])

	useEffect(() => {
		KycDao.initialize(config)
			.then((result) => {
				setKycDao(result)

				if (onReady) {
					onReady(result)
				}
			})
			.catch((error) => {
				errorHandler("fatal", error, dispatch, messageTargetOrigin)
			})
	}, [config, onReady, messageTargetOrigin])

	useEffect(() => {
		if (isModal) {
			const close = OnClose.subscribe(() => {
				if (data.isProcessSuccess) {
					window.parent.postMessage(
						{
							type: "kycDaoSuccess",
							data:
								data.alreadyHaveAnNftOnThisChain && !data.nearMinted
									? `Already has an nft on ${kycDao?.kycDao.connectedWallet?.blockchainNetwork}.`
									: data.chainExplorerUrl,
						} as KycDaoClientMessageBody,
						messageTargetOrigin
					)
				} else {
					window.parent.postMessage(
						{ type: "kycDaoCloseModal" } as KycDaoClientMessageBody,
						messageTargetOrigin
					)
				}
			})
			return close.unsubscribe.bind(close)
		}
	}, [
		data.chainExplorerUrl,
		data.isProcessSuccess,
		messageTargetOrigin,
		data.nearMinted,
		isModal,
		kycDao?.kycDao.connectedWallet?.blockchainNetwork,
		data.alreadyHaveAnNftOnThisChain,
	])

	if (!kycDao) {
		return (
			<StrictMode>
				<AppStyleContainer>
					<StateContext.Provider value={contextData}>
						<Header />
						<Router />
						<ModalRouter />
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
