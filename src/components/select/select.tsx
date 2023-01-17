/*import clsx from "clsx"
import {
	FC,
	MouseEvent,
	PropsWithChildren,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react"

import classes from "./_select.module.scss"

import styled from "styled-components"

type InputProps = {
	placeholder?: string
	onChange: (value: string) => void
	disabled?: boolean
	id?: string
	className?: string
	value?: string
	values: { value: string; label: string }[]
}

export const Option = styled.div`
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

const SelectBody = styled.div`
	height: var(--kyc-sdk-button-height);
	display: inline-flex;
	justify-content: space-between;
	padding-left: 1.5em;
	align-items: center;
	margin-top: 1em;
	margin-bottom: 1em;
	position: relative;
	box-shadow: 0 0 0 0 rgba(white, 0);
	background: #ecf0fe;
	border-radius: var(--kyc-sdk-border-radius-light);
	font-size: 12pt;
	border-width: 2pt;
	border-style: solid;
	font-family: var(--kyc-sdk-primary-font);
	color: black;
`

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
			<SelectBody
				id={id}
				className={clsx(
					disabled && classes["kyc-dao-web-sdk-opener-disabled"],
					className,
					open && classes["kyc-dao-web-sdk-open"]
				)}
				placeholder={placeholder}
				onClick={(e: MouseEvent) => setOpen(true)}>
				{values.find((v) => v.value === value)?.label}
			</SelectBody>
			{open &&
				values.map(({ label, value }, i) => (
					<Option onClick={onChangeEventHndlr(value)} key={value}>
						{label}
					</Option>
				))}
		</div>
	)
}
*/
