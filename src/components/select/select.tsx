import {
	FC,
	MouseEvent,
	PropsWithChildren,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react"

type InputProps = {
	placeholder?: string
	onChange: (value: string) => void
	disabled?: boolean
	id?: string
	className?: string
	value?: string
	values: { value: string; label: string }[]
}

export const Select: FC<PropsWithChildren<InputProps>> = ({
	disabled,
	placeholder = "",
	onChange,
	id,
	className,
	value,
	values,
}) => {
	const onChangeEventHndlr = useCallback(
		(newValue: string) => () => {
			onChange(newValue)
			setOpen(false)
		},
		[onChange]
	)

	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		function closeEventHndlr(this: Document, event: globalThis.MouseEvent) {
			if (
				ref.current &&
				event.target &&
				!ref.current.contains(event.target as Node)
			) {
				setOpen(false)
			}
		}

		document.addEventListener("mousedown", closeEventHndlr)

		return () => document.removeEventListener("mousedown", closeEventHndlr)
	}, [])

	return (
		<div ref={ref}>
			<div
				id={id}
				className={`kyc-sdk-select full-width ${disabled ? "disabled" : ""}${
					className ? ` ${className}` : ""
				}${open ? " open" : ""}`}
				placeholder={placeholder}
				onClick={(e: MouseEvent) => setOpen(true)}>
				{values.find((v) => v.value === value)?.label}
			</div>
			{open &&
				values.map(({ label, value }, i) => (
					<div
						className={`kyc-sdk-option full-width${i === 0 ? " first" : ""}`}
						onClick={onChangeEventHndlr(value)}
						key={value}>
						{label}
					</div>
				))}
		</div>
	)
}
