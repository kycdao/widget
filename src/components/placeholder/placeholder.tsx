import { CSSProperties } from "react"
import styled from "styled-components"

export type PlaceholderProps = {
	width: string
	height: string
	onClick?: () => void
	style?: CSSProperties
	showSize?: boolean
}

const unstyledPlaceholder = ({
	height,
	onClick,
	showSize,
	width,
}: PlaceholderProps) => <div>{showSize ? `${width}&times;${height}` : ""}</div>

export const Placeholder = styled(unstyledPlaceholder)<{
	height: string
	width: string
	onClick?: () => void
	showSize?: boolean
}>`
	display: flex;
	align-items: center;
	justify-content: center;
	background: grey;
	color: white;
	user-select: none;
	font-family: sans-serif;
	font-size: 3vw;
	width: ${({ width }) => width};
	height: ${({ height }) => height};
	cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
`
