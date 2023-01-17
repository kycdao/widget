import clsx from "clsx"
import {
	CSSProperties,
	FC,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react"

import classes from "./submitButton.module.scss"
import { Button } from "@Components/button/button"

export type ButtonProps = {
	onClick?: () => void
	className?: string
	label?: string
	disabled?: boolean
	style?: CSSProperties
	autoFocus?: boolean
	inactive?: boolean
	fullWidth?: boolean
	black?: boolean
}

export const SubmitButton: FC<ButtonProps> = ({
	style,
	disabled = false,
	onClick,
	className,
	autoFocus,
	inactive = false,
	label,
	black = false,
	fullWidth = false,
}) => {
	const ref = useRef<HTMLButtonElement>(null)
	const [innerHtml, setInnerHtml] = useState(label ? label : "Submit")

	useEffect(() => {
		if (autoFocus && !disabled && !inactive) {
			ref.current?.focus({ preventScroll: true })
		}
	}, [disabled, autoFocus, inactive])

	const onMouseEnter = useCallback(() => {
		setInnerHtml(label ? label : "Next")
	}, [label])

	const onMouseLeave = useCallback(() => {
		setInnerHtml(label ? label : "Submit")
	}, [label])

	return (
		<Button
			mode="black"
			style={style}
			disabled={disabled}
			ref={ref}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			fullWidth
			className={clsx(
				classes["kyc-dao-web-sdk-submit-button"],
				className
				// disabled ? buttonClasses[disabled] : null
			)}
			onClick={inactive ? undefined : onClick}>
			<i
				className={clsx(
					"material-icons",
					classes["kyc-dao-web-sdk-first-arrow"]
				)}>
				arrow_forward
			</i>
			<span>{innerHtml}</span>
			<i
				className={clsx(
					"material-icons",
					classes["kyc-dao-web-sdk-second-arrow"]
				)}>
				arrow_forward
			</i>
		</Button>
	)
}
