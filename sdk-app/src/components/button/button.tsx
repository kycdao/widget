import { CSSProperties, FC, useCallback, useRef, useState } from "react"
import './button.scss'

export type ButtonProps = {
    onClick?: () => void
    className?: string
    label?: string
    hoverLabel?: string
    hideArrow?: boolean
    disabled?: boolean
    style?: CSSProperties
}

export const Button: FC<ButtonProps> = ({ style ,disabled = false ,onClick, label = 'Submit', className, hoverLabel = 'Next', hideArrow = false }) => {
    const ref = useRef<HTMLButtonElement>(null)
    const [innerHtml, setInnerHtml] = useState(label)

    const innerHtmlSetter = useCallback((label: string) =>() => {
        setInnerHtml(label)
    }, [])

    return <button style={style} disabled={disabled} ref={ref} onMouseEnter={innerHtmlSetter(hoverLabel)} onMouseLeave={innerHtmlSetter(label)}  className={`kyc-button ${className}`} onClick={onClick}>
        <span>
            {innerHtml}
        </span>
        { !hideArrow && <i className="material-icons arrow"> arrow_forward </i>}
    </button>
}