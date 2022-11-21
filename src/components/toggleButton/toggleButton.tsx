import { CSSProperties, FC } from "react"
import "./toggleButton.scss"

export type ToggleButtonProps = {
	onClick?: () => void
	className?: string
	label?: string
	hoverLabel?: string
	hideArrow?: boolean
	disabled?: boolean
	style?: CSSProperties
	toggle?: boolean
	inactive?: boolean
}

export const ToggleButton: FC<ToggleButtonProps> = ({
	toggle,
	style,
	disabled = false,
	onClick,
	label,
	className,
	inactive,
}) => {
	return (
		<button
			style={style}
			disabled={disabled}
			className={`kyc-toggle-button ${className}${
				toggle ? " toggled" : ""
			} full-width`}
			onClick={inactive ? undefined : onClick}>
			<span>{label}</span>
		</button>
	)
}
