import React, { useEffect } from "react"
import { KycDaoClient } from "./KycDaoClient"
import { createRoot } from "react-dom/client"

const Iframe: React.FC = () => {
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const client = new KycDaoClient({
			parent: "#modalRoot",
			configFromUrl: true,
		})

		client.open()
	}, [])

	return <div id="modalRoot" />
}

const root = createRoot(document.getElementById("root") as HTMLElement)

root.render(
	<React.StrictMode>
		<Iframe />
	</React.StrictMode>
)

export default Iframe
