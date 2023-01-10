import { CSSProperties, FC } from "react"
import styled from "styled-components"

export type PlaceholderProps = {
	width: string
	height: string
	onClick?: () => void
	style?: CSSProperties
	showSize?: boolean
}

const unstyledPlaceholder: FC<PlaceholderProps> = ({
	height,
	width,
	onClick,
	style,
	showSize = false,
}) => {
	return (
		<div
			onClick={onClick}
			style={{
				width,
				height,
				cursor: onClick ? "pointer" : "default",
				...style,
			}}>
			{showSize ? `${width}&times;${height}` : ""}
		</div>
	)
}

export const Placeholder = styled(unstyledPlaceholder)`
	display: flex;
	align-items: center;
	justify-content: center;
	background: grey;
	color: white;
	user-select: none;
	font-family: sans-serif;
	font-size: 3vw;
`
