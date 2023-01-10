import { KycDao, SdkConfiguration } from "@kycdao/kycdao-sdk"
import { FC, useEffect, useMemo, useReducer, useState } from "react"
import { KycDaoContext, KycDaoState } from "@Components/kycDao.provider"
import {
	StepID,
	reducer,
	StateContext,
	DefaultData,
	OnClose,
	DataActionTypes,
	HeaderButtons,
} from "@Components/stateContext"
import { LoadingCard } from "./pages/loading/loading"
import { Header } from "@Components/header/header"
import { Router } from "@Components/router/router"
import { ModalRouter } from "@Components/modal/modalRouter"

import { getNetworkType } from "./utils/getNetworkType"

import "./style/index.scss"

//set body to unscrollable temporarily

export type KycDaoModalProps = {
	width?: number | string
	height?: number | string
	config: SdkConfiguration
	iframeOptions?: { messageTargetOrigin: string }
	isModal: boolean
}

export const KycDaoModal: FC<KycDaoModalProps> = ({
	height = 650,
	width = 400,
	config,
	iframeOptions,
	isModal,
}) => {
	DefaultData.isModal = isModal

	const [data, dispatch] = useReducer(reducer, DefaultData)
	const [kycDao, setKycDao] = useState<KycDaoState>()

	useEffect(() => {
		if (iframeOptions && "virtualKeyboard" in navigator) {
			navigator.virtualKeyboard.overlaysContent = true
		}
	}, [iframeOptions])

	useEffect(() => {
		KycDao.initialize({
			...config,
		}).then((results) => {
			setKycDao({ ...results, width, height })
		})
	}, [config, width, height])

	useEffect(() => {
		if (isModal) {
			const close = OnClose.subscribe(() => {
				if (data.currentPage === StepID.finalStep) {
					window.parent.postMessage(
						{ type: "kycDaoSuccess", data: data.chainExplorerUrl },
						data.messageTargetOrigin
					)
				} else {
					window.parent.postMessage(
						{ type: "kycDaoCloseModal" },
						data.messageTargetOrigin
					)
				}
			})
			return close.unsubscribe.bind(close)
		}
	}, [data, isModal])

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
						startPage = kycDao.kycDao.subscribed
							? StepID.subscribedStartStep
							: StepID.AgreementStep
					}

					dispatch({
						payload: { current: startPage, prev: StepID.loading },
						type: DataActionTypes.changePage,
					})

					dispatch({
						payload:
							iframeOptions?.messageTargetOrigin || window.location.origin,
						type: DataActionTypes.setMessageTargetOrigin,
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

	const contextData = useMemo(() => ({ data, dispatch }), [data, dispatch])

	if (!kycDao) {
		return <LoadingCard />
	}

	return (
		<KycDaoContext.Provider value={kycDao}>
			<StateContext.Provider value={contextData}>
				<div>
					<Header />
					<Router />
					<ModalRouter />
				</div>
			</StateContext.Provider>
		</KycDaoContext.Provider>
	)
}

export default KycDaoModal
