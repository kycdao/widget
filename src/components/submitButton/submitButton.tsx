import {
	CSSProperties,
	FC,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react"

export type ButtonProps = {
	onClick?: () => void
	className?: string
	label?: string
	disabled?: boolean
	style?: CSSProperties
	autoFocus?: boolean
	inactive?: boolean
}

export const SubmitButton: FC<ButtonProps> = ({
	style,
	disabled = false,
	onClick,
	className,
	autoFocus,
	inactive = false,
	label,
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
		<button
			style={style}
			disabled={disabled}
			ref={ref}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			className={`kyc-submit-button kyc-button ${className}`}
			onClick={inactive ? undefined : onClick}>
			<i className="material-icons first-arrow"> arrow_forward </i>
			<span>{innerHtml}</span>
			<i className="material-icons second-arrow"> arrow_forward </i>
		</button>
	)
}
