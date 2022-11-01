import { CSSProperties, FC, useCallback, useEffect, useRef, useState } from "react"
import './button.scss'

export type ButtonProps = {
    onClick?: () => void
    className?: string
    label?: string
    disabled?: boolean
    style?: CSSProperties
    autoFocus?: boolean
    inactive?: boolean
}

export const SubmitButton: FC<ButtonProps> = ({ style, disabled = false, onClick, className, autoFocus, inactive = false }) => {
    const ref = useRef<HTMLButtonElement>(null)
    const [innerHtml, setInnerHtml] = useState('Submit')

    useEffect(() => {
        if (autoFocus && !disabled) {
            ref.current?.focus({ preventScroll: true })
        }
    }, [disabled, autoFocus])

    return <button
        style={style}
        disabled={disabled}
        ref={ref}
        onMouseEnter={() => setInnerHtml('Next')}
        onMouseLeave={() => setInnerHtml('Submit')}
        className={`kyc-button ${className}`}
        onClick={inactive ? undefined : onClick}>
        <i className="material-icons first-arrow"> chevron_right </i>
        <span>
            {innerHtml}
        </span>
        <i className="material-icons second-arrow"> chevron_right </i>
    </button>
}
