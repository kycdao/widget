import { CSSProperties, FC } from "react"
import './button.scss'

export type ButtonProps = {
    onClick?: () => void
    className?: string
    disabled?: boolean
    style?: CSSProperties
    label: string
}

export const Button: FC<ButtonProps> = ({ style, disabled = false, onClick, className, label }) => {

    return <button style={style} disabled={disabled} className={`kyc-button ${className}`} onClick={onClick}>
        <span>
            {label}
        </span>
    </button>
}