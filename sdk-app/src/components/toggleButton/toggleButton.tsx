import { CSSProperties, FC } from "react"
import './toggleButton.scss'

export type ToggleButton = {
    onClick?: () => void
    className?: string
    label?: string
    hoverLabel?: string
    hideArrow?: boolean
    disabled?: boolean
    style?: CSSProperties
    toggle?: boolean
}

export const ToggleButton: FC<ToggleButton> = ({ toggle, style, disabled = false, onClick, label, className }) => {
    return <button style={style} disabled={disabled} className={`kyc-toggle-button   ${className}${toggle ? ' toggled' : ''} full-width`} onClick={onClick}>
        <span>{label}</span>
    </button>
}
