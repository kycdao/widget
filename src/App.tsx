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
} from "./components/stateContext"
import { Loading } from "./pages/loading"
import { Header } from "./components/header/header"
import { Router } from "./components/router/router"
import { ModalRouter } from "./components/modal/modalRouter"

import "./style/index.scss"

if ("virtualKeyboard" in navigator) {
	navigator.virtualKeyboard.overlaysContent = true
}

export type KycDaoModalProps = {
	width?: number | string
	height?: number | string
	config: SdkConfiguration
	iframeOptions?: { messageTargetOrigin: string }
}

export const KycDaoModal: FC<KycDaoModalProps> = ({
	height = 650,
	width = 400,
	config,
	iframeOptions,
}) => {
	const [data, dispatch] = useReducer(reducer, DefaultData)
	const [kycDao, setKycDao] = useState<KycDaoState>()

	useEffect(() => {
		KycDao.initialize(config).then((results) => {
			setKycDao({ ...results, width, height })
		})
	}, [config, width, height])

	useEffect(() => {
		const close = OnClose.subscribe(() => {
			window.parent.postMessage(
				{ type: "kycDaoCloseModal" },
				iframeOptions?.messageTargetOrigin || window.location.origin
			)
		})
		return close.unsubscribe.bind(close)
	}, [iframeOptions])

	useEffect(() => {
		if (kycDao) {
			dispatch({
				payload: { current: StepID.AgreementStep, prev: StepID.loading },
				type: DataActionTypes.changePage,
			})
		}
	}, [kycDao])

	const contextData = useMemo(() => ({ data, dispatch }), [data, dispatch])

	if (!kycDao) {
		return <Loading />
	}

	return (
		<KycDaoContext.Provider value={kycDao}>
			<StateContext.Provider value={contextData}>
				<Header />
				<Router />
				<ModalRouter />
			</StateContext.Provider>
		</KycDaoContext.Provider>
	)
}

export default KycDaoModal
