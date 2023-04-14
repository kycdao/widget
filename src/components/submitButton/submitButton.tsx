import { Button } from "@Components/button/button"
import { tr2, translateX } from "@Components/typography"
import {
	CSSProperties,
	FC,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react"

import styled from "styled-components"

export type SubmitButtonProps = {
	onClick?: () => void
	className?: string
	label?: string
	label2?: string
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

const UnstyledSubmitButton: FC<SubmitButtonProps> = ({
	disabled = false,
	onClick,
	className,
	autoFocus,
	inactive = false,
	label,
	label2,
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
		setInnerHtml(label2 ? label2 : "Next")
	}, [label2])

	const onMouseLeave = useCallback(() => {
		setInnerHtml(label ? label : "Submit")
	}, [label])

	return (
		<Button
			aria-disabled={disabled || inactive}
			mode="black"
			disabled={disabled || inactive}
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
