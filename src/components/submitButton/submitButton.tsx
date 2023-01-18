import {
	CSSProperties,
	FC,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react"

import { Button } from "@Components/button/button"
import styled from "styled-components"
import { tr2 } from "@Style/transitions"
import { translateX } from "@Style/index"

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

const FirstArrow = styled.i`
	position: absolute;
	right: 3rem;
	opacity: 0;
	${translateX(0)};
	${tr2};
`

const SecondArrow = styled.i`
	position: absolute;
	right: 1rem;
	${translateX(0)};
	${tr2};
`

const UnstyledSubmitButton: FC<ButtonProps> = ({
	style,
	disabled = false,
	onClick,
	className,
	autoFocus,
	inactive = false,
	label,
	fullWidth = true,
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
			fullWidth={fullWidth}
			className={className}
			onClick={inactive ? undefined : onClick}>
			<span>{innerHtml}</span>
			<FirstArrow className="material-icons">arrow_forward</FirstArrow>
			<SecondArrow className="material-icons">arrow_forward</SecondArrow>
		</Button>
	)
}

export const SubmitButton = styled(UnstyledSubmitButton)`
	overflow: hidden;

	span,
	.material-icons {
		padding-left: 1.5rem;
	}

	:hover {
		${FirstArrow} {
			${translateX("2rem")};
			opacity: 1;
		}

		${SecondArrow} {
			${translateX("8rem")};
		}
	}
`
