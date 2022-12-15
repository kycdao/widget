import { FC, useEffect, useRef } from "react"

import "./style/index.scss"
import { KycDaoClient } from "./KycDaoClient"
import {
	KycDaoClientInterface,
	KycDaoClientOptions,
} from "./KycDaoClientCommon"

export type KycDaoWidgetConfig = KycDaoClientOptions

export const KycDaoWidget: FC<KycDaoWidgetConfig> = (config) => {
	const parent = useRef<HTMLDivElement>(null)
	const client = useRef<KycDaoClientInterface>()

	useEffect(() => {
		const ClientConstructor = KycDaoClient as unknown as {
			new (config: KycDaoClientOptions): KycDaoClientInterface
		}

		if (parent.current) {
			client.current = new ClientConstructor(config)
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
