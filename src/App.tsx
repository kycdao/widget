import { KycDao, SdkConfiguration } from "@kycdao/kycdao-sdk"
import { FC, useEffect, useMemo, useReducer, useRef, useState } from "react"
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
import { LoadingCard } from "@Pages/loading/loading"
import { Header } from "@Components/header/header"
import { Router } from "@Components/router/router"
import { ModalRouter } from "@Components/modal/modalRouter"

import { getNetworkType } from "./utils/getNetworkType"

import "./style/app.scss"
import styled from "styled-components"

//set body to unscrollable temporarily

export type KycDaoModalProps = {
	width?: number | string
	height?: number | string
	config: SdkConfiguration
	iframeOptions?: { messageTargetOrigin: string }
	isModal: boolean
}

const AppContainer = styled.div`
	--kyc-sdk-primary-font: "neue-machina";
	--kyc-sdk-cybergreen: #00ffb3;
	--kyc-sdk-cybergreen-35: rgba(0, 255, 177, 0.35);
	--kyc-sdk-cybergreen-50: rgba(0, 255, 177, 0.5);
	--darken-green: #0af292;

	--kyc-sdk-normal-blue: #3a4be9;
	--kyc-sdk-dark-blue: #181f60;
	--kyc-sdk-dark-purple: #21114a;
	--kyc-sdk-green: #03f682;
	--kyc-sdk-green-darken: #0bcb77;
	--kyc-sdk-dark-green: #09b678;
	--kyc-sdk-cyberpunk: #72f9d1;
	--kyc-sdk-red: #ff4646;
	--kyc-sdk-red-darken: #d51f4f;

	--kyc-sdk-border: rgba(24, 31, 96, 0.05);
	--steps-padding: 2rem;
	--kyc-sdk-border-radius-full: 999rem;
	--kyc-sdk-border-radius-light: 5px;
	--kyc-sdk-inactive: #d7d9df;

	--kyc-sdk-button-height: 3rem;
	--kyc-sdk-header-height: 64px;
	--kyc-sdk-unit: 4.166666666666667vw;
	--kyc-sdk-connect-button-width: 19rem;

	--kyc-sdk-normal-blue-75: rgba(58, 75, 233, 0.75);
	--kyc-sdk-normal-blue-50: rgba(58, 75, 233, 0.5);
	--kyc-sdk-normal-blue-35: rgba(58, 75, 233, 0.35);
	--kyc-sdk-normal-blue-15: rgba(58, 75, 233, 0.15);

	--kyc-sdk-dark-blue-35: rgba(24, 31, 96, 0.35);
	--kyc-sdk-dark-blue-50: rgba(24, 31, 96, 0.5);
	--kyc-sdk-dark-blue-75: rgba(24, 31, 96, 0.75);

	--kyc-sdk-green-35: rgba(3, 246, 13, 0.35);
	--kyc-sdk-green-50: rgba(3, 246, 13, 0.5);
	--kyc-sdk-green-75: rgba(3, 246, 13, 0.75);

	--kyc-sdk-cyberpunk-15: rgba(144, 249, 209, 0.15);
	--kyc-sdk-cyberpunk-35: rgba(144, 249, 209, 0.35);
	--kyc-sdk-cyberpunk-50: rgba(144, 249, 209, 0.5);

	--kyc-sdk-red-35: rgba(255, 70, 70, 0.35);

	--light-font: gilroyLight;
	--display-font: gilroyBold;
`

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
	const sdkInitCallHappened = useRef(false)

	useEffect(() => {
		if (iframeOptions && "virtualKeyboard" in navigator) {
			navigator.virtualKeyboard.overlaysContent = true
		}
	}, [iframeOptions])

	useEffect(() => {
		sdkInitCallHappened.current = true
		KycDao.initialize(config).then((results) => {
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
					// 2x indul ez a roossz
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
							: StepID.taxResidenceStep
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
				<AppContainer>
					<Header />
					<Router />
					<ModalRouter />
				</AppContainer>
			</StateContext.Provider>
		</KycDaoContext.Provider>
	)
}

export default KycDaoModal
