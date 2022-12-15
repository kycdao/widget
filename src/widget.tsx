import { FC, useEffect, useRef } from "react"

import "./style/index.scss"
import { KycDaoClient } from "./KycDaoClient"
import {
	IframeOptions,
	KycDaoClientInterface,
	KycDaoClientOptions,
} from "./KycDaoClientCommon"
import { SdkConfiguration } from "@kycdao/kycdao-sdk"

export type KycDaoWidgetConfig = {
	parent: HTMLElement | string
	config: SdkConfiguration
	onFail?: (reason: string) => void
	onSuccess?: (data?: string) => void
}

export const KycDaoWidget: FC<KycDaoWidgetConfig> = (config) => {
	const parent = useRef<HTMLDivElement>(null)
	const client = useRef<KycDaoClientInterface>()

	useEffect(() => {
		const ClientConstructor = KycDaoClient as unknown as {
			new (config: KycDaoClientOptions): KycDaoClientInterface
		}

		if (parent.current) {
			client.current = new ClientConstructor({
				...config,
				width: 400,
				height: 650,
				configFromUrl: false,
			})
			client.current.open()
		} else {
			console.error("Something went wrong, check the widget creator function!")
		}

		return () => {
			client.current?.close()
		}
	}, [config])

	return <div ref={parent} />
}

window.KycDaoWidget = KycDaoWidget
