import { KycDao, SdkConfiguration } from "@kycdao/kycdao-sdk"
import { FC, useEffect, useMemo, useReducer, useState } from "react"
import { KycDaoContext, KycDaoState } from "./components/kycDao.provider"
import {
	StepID,
	reducer,
	StateContext,
	DefaultData,
	OnClose,
	DataActionTypes,
	HeaderButtons,
} from "./components/stateContext"
import { Loading } from "./pages/loading"
import { Header } from "./components/header/header"
import { Router } from "./components/router/router"
import { ModalRouter } from "./components/modal/modalRouter"

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
				window.parent.postMessage(
					{ type: "kycDaoCloseModal" },
					data.messageTargetOrigin
				)
			})
			return close.unsubscribe.bind(close)
		}
	}, [data, isModal])

	useEffect(() => {
		if (kycDao) {
			dispatch({
				type: DataActionTypes.setModalMode,
				payload: isModal,
			})
			dispatch({
				payload: { current: StepID.AgreementStep, prev: StepID.loading },
				type: DataActionTypes.changePage,
			})
			dispatch({
				payload: iframeOptions?.messageTargetOrigin || window.location.origin,
				type: DataActionTypes.setMessageTargetOrigin,
			})
			if (!isModal) {
				dispatch({
					type: DataActionTypes.SetHeaderButtonState,
					payload: { button: HeaderButtons.close, state: "hidden" },
				})
			}
		}
	}, [kycDao, iframeOptions, isModal])

	const contextData = useMemo(() => ({ data, dispatch }), [data, dispatch])

	if (!kycDao) {
		return <Loading />
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
