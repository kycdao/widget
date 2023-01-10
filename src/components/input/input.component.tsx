import clsx from "clsx"
import {
	ChangeEventHandler,
	createRef,
	FC,
	HTMLInputTypeAttribute,
	RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react"

import classes from "./_input.module.scss"

const specialRegex = /[!$(){}[\]:;<+?\\>]/g

type InputProps = {
	placeholder: string
	onChange?: (value: string) => void
	disabled?: boolean
	id?: string
	className?: string
	value?: string
	autoCompleteData?: string[]
	autoFocus?: boolean
	inputRef: RefObject<HTMLInputElement>
	onInputBlurred?: () => void
	onInputFocused?: () => void
	type?: HTMLInputTypeAttribute
	fullWidth?: boolean
}

export const Input: FC<InputProps> = ({
	disabled,
	placeholder,
	onChange,
	id,
	className,
	value = "",
	autoCompleteData,
	autoFocus,
	inputRef = createRef(),
	onInputBlurred,
	onInputFocused,
	type,
	fullWidth = true,
}) => {
	const [showAutoComplete, setShowAutoComplete] = useState(false)
	const autocompleteRef = useRef<HTMLDivElement>(null)

	const onChangeEventHndlr: ChangeEventHandler<HTMLInputElement> = useCallback(
		({ target: { value } }) => {
			if (onChange) {
				onChange(value)
			}
			setShowAutoComplete(true)
		},
		[onChange]
	)

	useEffect(() => {
		const closeEventHndlr = ({ target }: MouseEvent) => {
			if (
				autocompleteRef.current &&
				!autocompleteRef.current.contains(target as Node)
			) {
				setShowAutoComplete(false)
			}
		}

		document.addEventListener("mousedown", closeEventHndlr)

		return () => document.removeEventListener("mousedown", closeEventHndlr)
	}, [autocompleteRef])

	useEffect(() => {
		const hndlr = () => {
			if (!showAutoComplete) {
				setShowAutoComplete(true)
			}
		}

		const { current } = inputRef

		current?.addEventListener("focus", hndlr)

		return () => {
			current?.addEventListener("focus", hndlr)
		}
	}, [showAutoComplete, inputRef])

	const onAutocompleteHndlr = useCallback(
		(value: string) => () => {
			if (onChange) {
				onChange(value)
			}
			setShowAutoComplete(false)
		},
		[onChange]
	)

	const onClear = useCallback(() => {
		if (onChange && value) {
			onChange("")
		}
	}, [onChange, value])

	useEffect(() => {
		if (!disabled && autoFocus) {
			inputRef.current?.focus({ preventScroll: true })
		} else if (disabled && autoFocus) {
			inputRef.current?.blur()
		}
	}, [disabled, autoFocus, inputRef])

	return (
		<>
			{showAutoComplete && autoCompleteData && (
				<div ref={autocompleteRef} className={classes.autocomplete}>
					{autoCompleteData
						.filter((v) =>
							v.match(new RegExp(value.replace(specialRegex, ""), "ig"))
						)
						.map((v, i) => {
							return value !== "" ? (
								<div
									dangerouslySetInnerHTML={{
										__html: v.replace(
											new RegExp(`(${value.replace(specialRegex, "")})`, "ig"),
											"<strong>$1</strong>"
										),
									}}
									className={clsx(
										classes.option,
										classes["full-width"],
										i === 0 && "first"
									)}
									onClick={onAutocompleteHndlr(v)}
									key={v}
								/>
							) : (
								<div
									className={clsx(
										classes.option,
										classes["full-width"],
										i === 0 && "first"
									)}
									onClick={onAutocompleteHndlr(v)}
									key={v}>
									{v}
								</div>
							)
						})}
				</div>
			)}
			<input
				onBlur={onInputBlurred}
				onFocus={onInputFocused}
				ref={inputRef}
				id={id}
				className={clsx(
					classes.input,
					disabled && classes.disabled,
					className,
					fullWidth && classes["full-width"]
				)}
				type={type || "text"}
				placeholder={placeholder}
				onChange={onChangeEventHndlr}
				disabled={disabled}
				value={value}
			/>
			<div
				className={clsx(classes.clear, value === "" && classes.disabled)}
				onClick={onClear}>
				&times;
			</div>
		</>
	)
}
