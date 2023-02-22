import {
	KycDaoInitializationResult,
	SdkConfiguration,
} from "@kycdao/kycdao-sdk"
import { FC, useCallback, useEffect, useRef, useState } from "react"

import { AppContainer, AppContainerRef } from "./AppContainer"
import { RestartContext } from "@Components/restartContext"

const fontFile = new FontFace(
	"neue-machina",
	`url(${require("./fonts/NeueMachina-Regular.woff2")})`,
	{ weight: "400", style: "normal" }
)

document.fonts.add(fontFile)
fontFile.load()

export type KycDaoModalProps = {
	width?: number | string
	height?: number | string
	config: SdkConfiguration
	iframeOptions?: { messageTargetOrigin: string }
	isModal: boolean
	grantFlowEnabled?: boolean
	onReady?: (kycDaoSdkInstance: KycDaoInitializationResult) => void
}

export const KycDaoModal: FC<KycDaoModalProps> = (props) => {
	useEffect(() => {
		if (props.iframeOptions && "virtualKeyboard" in navigator) {
			navigator.virtualKeyboard.overlaysContent = true
		}
	}, [props.iframeOptions])

	const kycDaoSdkInstance = useRef<AppContainerRef>(null)

	const [key, setKey] = useState(Date.now())

	const RestartApp = useCallback(() => {
		setKey(Date.now())
	}, [])

	return (
		<RestartContext.Provider value={RestartApp}>
			<AppContainer ref={kycDaoSdkInstance} key={key} {...props} />
		</RestartContext.Provider>
	)
}

export default KycDaoModal
