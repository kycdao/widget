import { FC, PropsWithChildren } from "react"
import styled from "styled-components"

const UnStyledOption: FC<
	PropsWithChildren<{
		className: string
		onClick: () => void
	}>
> = ({ children, className }) => {
	return <div className={className}>{children}</div>
}

export const Option = styled(UnStyledOption)`
	border: 1pt;
	border-style: solid;
	height: var(--kyc-sdk-button-height);
	display: flex;
	justify-content: space-between;
	padding-left: 1.5em;
	align-items: center;
	position: relative;
	box-shadow: 0 0 0 0 rgba(white, 0);
	background: #ecf0fe;
	color: black;
	font-size: 11pt;
`
