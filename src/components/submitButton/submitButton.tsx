import { CSSProperties, FC, useCallback, useEffect, useRef, useState } from "react"
import './button.scss'

export type ButtonProps = {
    onClick?: () => void
    className?: string
    label?: string
    disabled?: boolean
    style?: CSSProperties
    autoFocus?: boolean
}

export const SubmitButton: FC<ButtonProps> = ({ style, disabled = false, onClick, className, autoFocus }) => {
    const ref = useRef<HTMLButtonElement>(null)
    const [innerHtml, setInnerHtml] = useState('Submit')

    const innerHtmlSetter = useCallback((label: string) => () => {
        setInnerHtml(label)
    }, [])

    useEffect(() => {
        if(autoFocus && !disabled) {
            ref.current?.focus({ preventScroll: true })
        }
    }, [])

    return <button style={style} disabled={disabled} ref={ref} onMouseEnter={innerHtmlSetter('Next')} onMouseLeave={innerHtmlSetter('Submit')} className={`kyc-button ${className}`} onClick={onClick}>
        <i className="material-icons first-arrow"> chevron_right </i>
        <span>
            {innerHtml}
        </span>
        <i className="material-icons second-arrow"> chevron_right </i>
    </button>
}
