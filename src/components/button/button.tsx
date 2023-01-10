import clsx from "clsx"
import { CSSProperties, FC } from "react"

import classes from "./_button.module.scss"

export type ButtonProps = {
	onClick?: () => void
	className?: string
	disabled?: boolean
	style?: CSSProperties
	children: JSX.Element[] | JSX.Element | string
	inactive?: boolean
	fullWidth?: boolean
	underline?: boolean
	centered?: boolean
}

export const Button: FC<ButtonProps> = ({
	style,
	disabled = false,
	onClick,
	className,
	inactive,
	children,
	fullWidth,
	underline,
	centered,
}) => {
	return (
		<button
			style={style}
			disabled={disabled}
			className={clsx(
				classes.button,
				className,
				fullWidth && classes["full-width"],
				underline && classes.underline,
				centered && classes.centered
			)}
			onClick={inactive ? undefined : onClick}>
			<span>{children}</span>
		</button>
	)
}
