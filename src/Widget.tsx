import {
	FC,
	PropsWithChildren,
	StrictMode,
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useState,
} from "react"

import {
	InternalError,
	KycDao,
	KycDaoInitializationResult,
	SdkConfiguration,
} from "@kycdao/kycdao-sdk"
import { KycDaoContext } from "@Components/kycDao.provider"
import {
	DataActionTypes,
	DefaultData,
	HeaderButtons,
	OnClose,
	reducer,
	StateContext,
	StepID,
} from "@Components/stateContext"
import { Header } from "@Components/header/header"
import { Router } from "@Pages/router"
import { ModalRouter } from "@Components/modal"
import styled from "styled-components/macro"
import { HandleError } from "@Hooks/useErrorHandler"
import { AppStyleContainer } from "@Components/appStyleContainer"
import { RestartContext } from "@Components/restartContext"
import NeueMachinaRegularBase64 from "./fonts/NeueMachina-Regular"
import { getNetworkType } from "@Utils/getNetworkType"
import {
	KycDaoMessageTypes,
	KycDaoOnRegisterOrLoginData,
	OnFailCallback,
	OnReadyCallback,
	OnSuccessCallback,
} from "./types"
import { nearNetworkRegex } from "./StandaloneClientCommon"

export interface ModalOptions {
	width: string | number
	height: string | number
	backdrop?: string
	enabled: boolean
}

export interface WidgetConfig {
	config: SdkConfiguration
	onFail?: OnFailCallback
	onSuccess?: OnSuccessCallback
	onReady?: OnReadyCallback
	isModal?: boolean
	modalOptions?: ModalOptions
	messageTargetOrigin?: string
}

export const defaultModalOptions: ModalOptions = {
	width: "400px",
	height: "650px",
	backdrop: "rgba(0, 0, 0, 0.7)",
	enabled: true,
}

export const WidgetModalContainer: FC<PropsWithChildren<ModalOptions>> = ({
	children,
	height,
	width,
	backdrop,
	enabled,
}) =>
	enabled ? (
		<ModalRoot backdrop={backdrop}>
			<Modal
				width={typeof width === "string" ? width : `${width}px`}
				height={typeof height === "string" ? height : `${height}px`}>
				{children}
			</Modal>
		</ModalRoot>
	) : (
		<>{children}</>
	)

// Debug purpose
window.name = "Widget window"

export const Widget: FC<WidgetConfig> = ({
	config,
	onReady,
	onFail,
	onSuccess,
	isModal = false,
	modalOptions = defaultModalOptions,
	messageTargetOrigin = window.location.origin,
}) => {
	const [data, dispatch] = useReducer(reducer, {
		...DefaultData,
		onSuccess,
		onFail,
	})
	const contextData = useMemo(() => ({ data, dispatch }), [data, dispatch])
	const [kycDao, setKycDao] = useState<KycDaoInitializationResult>()
	const [key, setKey] = useState(Date.now())

	const { width, height, backdrop } = modalOptions

	const startFlow = useCallback(async () => {
		// This keycheck required, to make the restart work
		if (key) {
			if (!kycDao || dispatch.toString() === "function () { }") return

			const [firstChainNetwork] = config.enabledBlockchainNetworks

			let modalTimeout

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

				modalTimeout = setTimeout(() => {
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

				//TODO Make this foolproof
				const isNearLoggedIn = Object.keys(localStorage).find((value) =>
					/near-api-js:keystore:(?!pending)(.*)/g.test(value)
				)

				if (
					nearNetworkRegex().test(firstChainNetwork) &&
					window !== window?.top &&
					!isNearLoggedIn
				) {
					window?.top?.postMessage(
						{
							data: firstChainNetwork as KycDaoOnRegisterOrLoginData,
							type: KycDaoMessageTypes.REGISTERORLOGIN,
						},
						messageTargetOrigin
					)

					return
				}

				// For some reason, solana don't throw an exeption in an inframe
				if ("Solana" === getNetworkType(firstChainNetwork)) {
					throw new InternalError("Solana is not supported yet.")
				}

				await kycDao.kycDao.connectWallet(getNetworkType(firstChainNetwork))

				dispatch({
					type: DataActionTypes.HideModal,
				})

				clearTimeout(modalTimeout)

				dispatch({
					type: DataActionTypes.setModalMode,
					payload: isModal,
				})

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

				await kycDao.kycDao.registerOrLogin()

				if (kycDao.redirectEvent) {
					dispatch({
						type: DataActionTypes.termsAcceptedChange,
						payload: true,
					})

					switch (kycDao.redirectEvent) {
						case "NearUserRejectedError":
							onFail?.()
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

				dispatch({ type: DataActionTypes.GoToNextStep })

				if (!isModal) {
					dispatch({
						type: DataActionTypes.SetHeaderButtonState,
						payload: { button: HeaderButtons.close, state: "hidden" },
					})
				}
			} catch (error) {
				HandleError(dispatch, "fatal", error, data.onFail)
				clearTimeout(modalTimeout)
			}
		}
	}, [
		config.enabledBlockchainNetworks,
		isModal,
		data.onFail,
		kycDao,
		onFail,
		messageTargetOrigin,
		key,
	])

	useEffect(() => {
		startFlow()
	}, [startFlow])

	useEffect(() => {
		dispatch({
			payload: messageTargetOrigin,
			type: DataActionTypes.setMessageTargetOrigin,
		})
	}, [dispatch, messageTargetOrigin])

	const RestartApp = useCallback(() => {
		dispatch({ type: DataActionTypes.Reset })
		setKey(Date.now())
	}, [])

	useEffect(() => {
		// This keycheck required, to make the restart work
		if (
			dispatch.toString() !== "function () { }" &&
			!kycDao &&
			!data.error &&
			key
		) {
			KycDao.initialize(config)
				.then((result) => {
					setKycDao(result)
					onReady?.(result)
				})
				.catch((error) => {
					HandleError(dispatch, "fatal", error, data.onFail)
				})
		}
	}, [config, onReady, dispatch, data.error, kycDao, data.onFail, key])

	useEffect(() => {
		const close = OnClose.subscribe(() => {
			if (data.isProcessSuccess) {
				onSuccess?.(
					data.alreadyHaveAnNftOnThisChain && !data.nearMinted
						? `Already has an nft on ${kycDao?.kycDao.connectedWallet?.blockchainNetwork}.`
						: data.chainExplorerUrl
				)
			} else {
				onFail?.()
			}
		})
		return close.unsubscribe.bind(close)
	}, [
		data.chainExplorerUrl,
		data.isProcessSuccess,
		data.nearMinted,
		kycDao?.kycDao.connectedWallet?.blockchainNetwork,
		data.alreadyHaveAnNftOnThisChain,
		onSuccess,
		onFail,
	])

	const InlineWidget = useMemo(
		() => (
			<WidgetModalContainer
				enabled={isModal}
				height={height}
				width={width}
				backdrop={backdrop}>
				<StrictMode>
					<StyledWidget key={key}>
						<RestartContext.Provider value={RestartApp}>
							<KycDaoContext.Provider value={kycDao}>
								<StateContext.Provider value={contextData}>
									<Header />
									<Router />
									<ModalRouter />
								</StateContext.Provider>
							</KycDaoContext.Provider>
						</RestartContext.Provider>
					</StyledWidget>
				</StrictMode>
			</WidgetModalContainer>
		),
		[RestartApp, contextData, key, kycDao, backdrop, isModal, height, width]
	)

	return InlineWidget
}

const StyledWidget = styled(AppStyleContainer)`
	width: 100%;
	@font-face {
		font-family: "neue-machina";
		src: url(${NeueMachinaRegularBase64});
		font-weight: 400;
	}
`

const ModalRoot = styled.div<Pick<ModalOptions, "backdrop">>`
	z-index: 9999;
	width: 100%;
	position: fixed;
	inset: 0;
	background: ${({ backdrop }) => backdrop || defaultModalOptions.backdrop};
	overflow: hidden;

	@media only screen and (min-width: 992px) {
		height: 100vh;
	}
`

const Modal = styled.div<Pick<ModalOptions, "width" | "height">>`
	box-shadow: 0 1px 174px rgba(59, 31, 69, 0.2);
	width: 100%;
	height: 100%;
	background-color: #fefefe;
	position: absolute;
	overflow: hidden;

	@media only screen and (min-width: 992px) {
		width: ${({ width }) => width};
		height: ${({ height }) => height};
		margin: auto;
		border-radius: 12px;
		overflow: hidden;
		inset: 0;
	}

	iframe {
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-width: 0;
	}
`
