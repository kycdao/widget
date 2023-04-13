import React from "react"
const IndexPage: React.FC = () => {
	return (
		<div>
			<a href='component'>Open the component example</a>
			<br />
			<br />
			<a href='iframe'>Open the iframe example</a>
		</div>
	)
}

export default IndexPage

export const Head = () => <title>Home Page</title>
