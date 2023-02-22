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
		const messageTargetOrigin =
			iframeOptions?.messageTargetOrigin || window.location.origin

		dispatch({
			payload: messageTargetOrigin,
			type: DataActionTypes.setMessageTargetOrigin,
		})
	}, [dispatch, iframeOptions?.messageTargetOrigin])

	useEffect(() => {
		if (kycDao) {
			;(async () => {
				try {
					await kycDao.kycDao.connectWallet(
						getNetworkType(config.enabledBlockchainNetworks[0])
					)
					await kycDao.kycDao.registerOrLogin()

					dispatch({
						type: DataActionTypes.setModalMode,
						payload: isModal,
					})

					if (
						await kycDao.kycDao.hasValidNft("KYC") /* ||
							(await kycDao.kycDao.hasValidNft("AccreditedInvestor"))*/
					) {
						dispatch({
							payload: {
								current: StepID.finalStep,
								prev: StepID.loading,
							},
							type: DataActionTypes.changePage,
						})

						dispatch({
							payload: true,
							type: DataActionTypes.SetProcessSucess,
						})

						dispatch({
							payload: true,
							type: DataActionTypes.SetAlreadyHaveAnNftOnThisChain,
						})

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

						dispatch({
							payload: true,
							type: DataActionTypes.SetReturnUserFlow,
						})

						startPage = subscribed
							? StepID.subscribedStartStep
							: StepID.kycDAOMembershipStep
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
				if (data.isProcessSuccess) {
					window.parent.postMessage(
						{
							type: "kycDaoSuccess",
							data: data.alreadyHaveAnNftOnThisChain
								? `Already has an nft on ${kycDao?.kycDao.connectedWallet?.blockchainNetwork}.`
								: data.chainExplorerUrl,
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
	}, [
		data.chainExplorerUrl,
		data.isProcessSuccess,
		data.messageTargetOrigin,
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
