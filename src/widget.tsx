import { FC, useEffect, useRef } from "react"

import { KycDaoClient } from "./StandaloneClient"
import {
	KycDaoClientInterface,
	KycDaoClientOptions,
} from "./StandaloneClientCommon"
import {
	KycDaoInitializationResult,
	SdkConfiguration,
} from "@kycdao/kycdao-sdk"

export interface KycDaoWidgetConfig {
	config: SdkConfiguration
	onFail?: (reason?: string) => void
	onSuccess?: (data?: string) => void
	onReady?: (kycDaoSdkInstance: KycDaoInitializationResult) => void
}

export const KycDaoWidget: FC<KycDaoWidgetConfig> = (props) => {
	const parent = useRef<HTMLDivElement>(null)
	const client = useRef<KycDaoClientInterface>()

	useEffect(() => {
		const ClientConstructor = KycDaoClient as unknown as {
			new (config: KycDaoClientOptions): KycDaoClientInterface
		}

		if (parent.current) {
			client.current = new ClientConstructor({
				...props,
				parent: parent.current,
				width: 400,
				height: 650,
				configFromUrl: false,
				modal: false,
				backdrop: false,
			})
			client.current.open()
		} else {
			console.error("Something went wrong, check the widget creator function!")
		}

		return () => {
			client.current?.close()
		}
	}, [props])

	return <div ref={parent} />
}

window.KycDaoWidget = KycDaoWidget
