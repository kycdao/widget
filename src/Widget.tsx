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
import useErrorHandler from "@Hooks/useErrorHandler"
import { AppStyleContainer } from "@Components/appStyleContainer"
import { RestartContext } from "@Components/restartContext"
import NeueMachinaRegularBase64 from "./fonts/NeueMachina-Regular"
import { getNetworkType } from "@Utils/getNetworkType"
import { OnFailCallback, OnReadyCallback, OnSuccessCallback } from "./types"
import {
	KycDaoClientMessageTypes,
	KycDaoClientRegisterOrLogin,
	nearNetworkRegex,
} from "StandaloneClientCommon"

export interface ModalOptions {
	width: string | number
	height: string | number
	backdrop?: string
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
}

export const WidgetModalContainer: FC<PropsWithChildren<ModalOptions>> = ({
	children,
	height,
	width,
	backdrop,
}) => {
	return (
		<ModalRoot backdrop={backdrop}>
			<Modal
				width={typeof width === "string" ? width : `${width}px`}
				height={typeof height === "string" ? height : `${height}px`}>
				{children}
			</Modal>
		</ModalRoot>
	)
}

export const Widget: FC<WidgetConfig> = ({
	config,
	onReady,
	onFail,
	onSuccess,
	isModal = false,
	modalOptions = {
		width: defaultModalOptions.width,
		height: defaultModalOptions.height,
	},
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
	const { handleError } = useErrorHandler()
	const { width, height, backdrop } = modalOptions

	const startFlow = useCallback(async () => {
		if (!kycDao) return

		const [firstChainNetwork] = config.enabledBlockchainNetworks

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

			nearNetworkRegex.lastIndex = 0

			//TODO Make this foolproof
			const isNearLoggedIn = Object.keys(localStorage).find((value) =>
				/near-api-js:keystore:(.*)/g.test(value)
			)

			if (
				nearNetworkRegex.test(firstChainNetwork) &&
				window !== window.parent &&
				!isNearLoggedIn
			) {
				window.parent.postMessage(
					{
						type: KycDaoClientMessageTypes.kycDaoRegisterOrLogin,
						data: { chainNetwork: [firstChainNetwork] },
					} as KycDaoClientRegisterOrLogin,
					messageTargetOrigin
				)

				return
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

			let startPage = StepID.AgreementStep

			if (kycDao.redirectEvent) {
				dispatch({
					type: DataActionTypes.termsAcceptedChange,
					payload: true,
				})

				switch (kycDao.redirectEvent) {
					case "NearLogin":
						startPage = StepID.AgreementStep
						break
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
						startPage = StepID.finalStep
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
		} catch (error) {
			handleError("fatal", error)
		}
	}, [
		config.enabledBlockchainNetworks,
		handleError,
		isModal,
		kycDao,
		onFail,
		messageTargetOrigin,
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
		setKey(Date.now())
	}, [])

	useEffect(() => {
		KycDao.initialize(config)
			.then((result) => {
				setKycDao(result)
				onReady?.(result)
			})
			.catch((error) => {
				handleError("fatal", error)
			})
	}, [config, handleError, onReady])

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
		isModal,
		kycDao?.kycDao.connectedWallet?.blockchainNetwork,
		data.alreadyHaveAnNftOnThisChain,
		onSuccess,
		onFail,
	])

	const InlineWidget = useMemo(
		() => (
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
		),
		[RestartApp, contextData, key, kycDao]
	)

	if (!kycDao) {
		return null
	}

	if (isModal) {
		return (
			<WidgetModalContainer height={height} width={width} backdrop={backdrop}>
				{InlineWidget}
			</WidgetModalContainer>
		)
	}

	return <StrictMode>{InlineWidget}</StrictMode>
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
	}
`
