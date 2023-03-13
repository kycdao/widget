import {
	KycDaoInitializationResult,
	SdkConfiguration,
} from "@kycdao/kycdao-sdk"
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"

import { AppContainer, AppContainerRef } from "./AppContainer"
import { RestartContext } from "@Components/restartContext"
import NeueMachinaRegularBase64 from "./fonts/NeueMachina-Regular"

const fontFile = new FontFace(
	"neue-machina",
	`url(${NeueMachinaRegularBase64})`,
	{
		weight: "400",
		style: "normal",
	}
)

document.fonts.add(fontFile)
fontFile.load()

window.Buffer = Buffer

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

	const messageTargetOrigin = useMemo(
		() => props.iframeOptions?.messageTargetOrigin || window.location.origin,
		[props.iframeOptions]
	)

	const kycDaoSdkInstance = useRef<AppContainerRef>(null)

	const [key, setKey] = useState(Date.now())

	const RestartApp = useCallback(() => {
		setKey(Date.now())
	}, [])

	return (
		<RestartContext.Provider value={RestartApp}>
			<AppContainer
				messageTargetOrigin={messageTargetOrigin}
				ref={kycDaoSdkInstance}
				key={key}
				{...props}
			/>
		</RestartContext.Provider>
	)
}

export default KycDaoModal
