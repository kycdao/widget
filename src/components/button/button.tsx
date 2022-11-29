import { CSSProperties, FC } from "react"
import "./_button.scss"

export type ButtonProps = {
	onClick?: () => void
	className?: string
	disabled?: boolean
	style?: CSSProperties
	children: JSX.Element[] | JSX.Element | string
	inactive?: boolean
}

export const Button: FC<ButtonProps> = ({
	style,
	disabled = false,
	onClick,
	className,
	inactive,
	children,
}) => {
	return (
		<button
			style={style}
			disabled={disabled}
			className={`kyc-button${className ? ` ${className}` : ""}`}
			onClick={inactive ? undefined : onClick}>
			<span>{children}</span>
		</button>
	)
}
