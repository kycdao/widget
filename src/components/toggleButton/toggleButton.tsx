/*import { CSSProperties, FC } from "react"
import styled from "styled-components/macro"

export type ToggleButtonProps = {
	onClick?: () => void
	className?: string
	label?: string
	hoverLabel?: string
	hideArrow?: boolean
	disabled?: boolean
	fullWidth?: boolean
	toggled?: boolean
	inactive?: boolean
	style?: CSSProperties
}

// not used btw

const Button = styled.button<{ fullWidth: boolean; toggled: boolean }>`
	display: inline-flex;
	justify-content: space-between;
	padding-left: 1.5rem;
	align-items: center;
	outline: none;
	border: 1px solid transparent;
	border-radius: var(--kyc-sdk-border-radius-light);
	cursor: pointer;
	height: var(--kyc-sdk-button-height);
	color: white;
	background: var(--kyc-sdk-normal-blue);
	box-shadow: 0 0 1pt 0 var(--kyc-sdk-normal-blue-35);
	margin-top: 1em;

	${({ toggled }) =>
		toggled &&
		`
				background: var(--kyc-sdk-green);
				box-shadow: 0 0 0 1pt var(--kyc-sdk-green-35);

				span,
				.material-icons {
					margin-left: 0.2em;
					color: white;
				}
	`}
`

export const ToggleButton: FC<ToggleButtonProps> = ({
	toggled = false,
	style,
	disabled = false,
	onClick,
	label,
	fullWidth = false,
	inactive,
}) => {
	return (
		<Button
			fullWidth={fullWidth}
			toggled={toggled}
			style={style}
			disabled={disabled}
			onClick={inactive ? undefined : onClick}>
			<span>{label}</span>
		</Button>
	)
}
*/
