import React from "react"
import Component from "./Component"
import Iframe from "./Iframe"
import "./App.css"

function App() {
	const [selectedIntegration, setSelectedIntegration] = React.useState<
		"component" | "iframe" | ""
	>("")

	return (
		<div>
			<select
				value={selectedIntegration}
				onChange={(e) => setSelectedIntegration(e.target.value as any)}>
				<option value="" disabled hidden>
					Choose here
				</option>
				<option value="component">Component</option>
				<option value="iframe">Iframe</option>
			</select>

			{selectedIntegration === "component" ? <Component /> : null}
			{selectedIntegration === "iframe" ? <Iframe /> : null}
		</div>
	)
}

export default App
