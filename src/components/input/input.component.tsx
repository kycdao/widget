import { tr2 } from "@Style/transitions"
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
import styled from "styled-components"

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

const StyledInput = styled.input<{
	disabled?: boolean
	showAutoComplete: boolean
}>`
	height: var(--kyc-sdk-button-height);
	display: inline-flex;
	justify-content: space-between;
	box-sizing: border-box;
	padding-left: 1.5em;
	align-items: center;
	margin: 1rem 0px;
	margin-bottom: 0;
	border: 2px solid black;
	outline: none;
	${({ showAutoComplete }) =>
		showAutoComplete
			? `border-radius: 0 0 var(--kyc-sdk-border-radius-light) var(--kyc-sdk-border-radius-light); margin-top: 0; outline: none;`
			: "border-radius: var(--kyc-sdk-border-radius-light);"}
	position: relative;
	box-shadow: 0 0 0 0 rgba(white, 0);
	background: white;
	color: black;
	font-size: 12pt;
	font-family: var(--kyc-sdk-primary-font);
	width: 100%;

	::placeholder {
		color: white;
		font-family: var(--kyc-sdk-primary-font);
	}

	::-webkit-input-placeholder {
		color: black;
		font-family: var(--kyc-sdk-primary-font);
	}

	:-ms-input-placeholder {
		color: black;
		font-family: var(--kyc-sdk-primary-font);
	}

	&:hover {
		border: 2px solid var(--kyc-sdk-cybergreen);
		${({ showAutoComplete }) =>
			!showAutoComplete
				? `box-shadow: 0 0 0 5px var(--kyc-sdk-cybergreen-50);`
				: "border-radius: 0 0 var(--kyc-sdk-border-radius-light) var(--kyc-sdk-border-radius-light);"}
		background: white;
	}

	&:focus {
		border: 2px solid var(--kyc-sdk-cybergreen);
		${({ showAutoComplete }) =>
			!showAutoComplete
				? `box-shadow: 0 0 0 5px var(--kyc-sdk-cybergreen-50);`
				: "border-radius: 0 0 var(--kyc-sdk-border-radius-light) var(--kyc-sdk-border-radius-light);"}
		color: white;
		background: black;
	}

	&:active {
		border: 2px solid var(--kyc-sdk-cybergreen);
		${({ showAutoComplete }) =>
			!showAutoComplete
				? `box-shadow: 0 0 0 5px var(--kyc-sdk-cybergreen-50);`
				: "border-radius: 0 0 var(--kyc-sdk-border-radius-light) var(--kyc-sdk-border-radius-light);"}
		color: white;
		background: black;
	}
`

const Clear = styled.div<{ active: boolean }>`
	position: absolute;
	right: 5px;
	bottom: 85px;
	font-size: 24px;
	display: flex;
	color: var(--kyc-sdk-cybergreen);
	cursor: pointer;
	border-radius: var(--kyc-sdk-border-radius-full);
	background: transparent;
	padding: 3px 9px;
	line-height: 132%;

	color: ${({ active }) =>
		active
			? `var(--kyc-sdk-cybergreen);
		 	@extend ${tr2};`
			: `black;`}

	&:hover:not([disabled]) {
		@extend ${tr2};
		background: var(--kyc-sdk-cybergreen-35);
	}

	&[disabled] {
		color: lightgrey;
		cursor: default;
	}
`

const Option = styled.div`
	height: 2.5em;
	cursor: pointer;
	line-height: 2.5em;
	padding-left: 1.5em;
	border-bottom: 1px solid var(--kyc-sdk-normal-blue-15);
	font-family: var(--kyc-sdk-primary-font);
	font-weight: 400;
	color: black;
	justify-content: left;
	white-space: pre;
	display: flex;
	width: 100%;

	strong {
		font-family: var(--kyc-sdk-primary-font);
		font-weight: 800;
		justify-content: center;
	}

	&:hover {
		background: var(--kyc-sdk-cybergreen-35);
		color: black;
	}
`

const Autocomplete = styled.div`
	width: 100%;
	max-height: 25vh;
	height: auto;
	overflow-y: auto;
	overflow-x: hidden;

	@media only screen and (min-width: 992px) {
		max-height: 20vh;
	}

	border: 2px solid var(--kyc-sdk-cybergreen);
	border-bottom: 0;
	border-radius: var(--kyc-sdk-border-radius-light);
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
	outline: none;
	border: none;
`

const Container = styled.div<{
	disabled?: boolean
	showAutoComplete: boolean
	active: boolean
}>`
	margin-bottom: 1em;
	box-sizing: border-box;
	${({ showAutoComplete }) =>
		showAutoComplete &&
		`
		box-shadow: 0 0 0 5px var(--kyc-sdk-cybergreen-50);
		border-radius: var(--kyc-sdk-border-radius-light);
	`}

	@extend ${tr2};

	&:has(${StyledInput}:hover) > ${Clear} {
		color: var(--kyc-sdk-cybergreen);
	}

	${({ active }) => active && `color: var(--kyc-sdk-cybergreen);`}
`

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
}) => {
	const [showAutoComplete, setShowAutoComplete] = useState(
		!!autoFocus && !!autoCompleteData
	)
	const autocompleteRef = useRef<HTMLDivElement>(null)
	const [focused, setFocused] = useState(!!autoFocus)

	const onChangeEventHndlr: ChangeEventHandler<HTMLInputElement> = useCallback(
		({ target: { value } }) => {
			if (onChange) {
				onChange(value)
			}
			if (autoCompleteData) {
				setShowAutoComplete(
					autoCompleteData.filter((v) =>
						v.match(new RegExp(value.replace(specialRegex, ""), "ig"))
					).length > 0
				)
			}
		},
		[onChange, autoCompleteData]
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
			if (!showAutoComplete && autoCompleteData) {
				setShowAutoComplete(
					autoCompleteData.filter((v) =>
						v.match(new RegExp(value.replace(specialRegex, ""), "ig"))
					).length > 0
				)
			}
		}

		const { current } = inputRef

		current?.addEventListener("focus", hndlr)

		return () => {
			current?.addEventListener("focus", hndlr)
		}
	}, [showAutoComplete, inputRef, autoCompleteData, value])

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
		inputRef.current?.focus()
	}, [onChange, value, inputRef])

	useEffect(() => {
		if (!disabled && autoFocus) {
			inputRef.current?.focus({ preventScroll: true })
		} else if (disabled && autoFocus) {
			inputRef.current?.blur()
		}
	}, [disabled, autoFocus, inputRef])

	const onBlur = useCallback(() => {
		if (onInputBlurred) {
			onInputBlurred()
		}

		setFocused(false)
	}, [onInputBlurred])

	const onFocus = useCallback(() => {
		if (onInputFocused) {
			onInputFocused()
		}

		setFocused(true)
	}, [onInputFocused])

	return (
		<Container active={focused} showAutoComplete={showAutoComplete}>
			{showAutoComplete && autoCompleteData && (
				<Autocomplete ref={autocompleteRef}>
					{autoCompleteData
						.filter((v) =>
							v.match(new RegExp(value.replace(specialRegex, ""), "ig"))
						)
						.map((v, i) => {
							return value !== "" ? (
								<Option
									dangerouslySetInnerHTML={{
										__html: v.replace(
											new RegExp(`(${value.replace(specialRegex, "")})`, "ig"),
											"<strong>$1</strong>"
										),
									}}
									className={clsx(
										classes["kyc-dao-web-sdk-full-width"],
										i === 0 && "first"
									)}
									onClick={onAutocompleteHndlr(v)}
									key={v}
								/>
							) : (
								<Option
									className={clsx(
										classes["kyc-dao-web-sdk-option"],
										classes["kyc-dao-web-full-width"],
										i === 0 && "first"
									)}
									onClick={onAutocompleteHndlr(v)}
									key={v}>
									{v}
								</Option>
							)
						})}
				</Autocomplete>
			)}
			<StyledInput
				showAutoComplete={showAutoComplete}
				onBlur={onBlur}
				onFocus={onFocus}
				ref={inputRef}
				id={id}
				className={className}
				type={type || "text"}
				placeholder={placeholder}
				onChange={onChangeEventHndlr}
				disabled={disabled}
				value={value}
			/>
			{value.length > 0 && (
				<Clear active={focused} className="material-icons" onClick={onClear}>
					close
				</Clear>
			)}
		</Container>
	)
}
