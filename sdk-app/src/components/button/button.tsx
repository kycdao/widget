import { FC, PropsWithChildren } from "react"
import './button.scss'

export type ButtonProps = {
    onClick?: () => void
    className?: string
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({ onClick, children, className }) => {
    return <button className={`kyc-button ${className}`} onClick={onClick}>
        <span>
            {children}
        </span>
        <i className="material-icons arrow"> arrow_forward </i>
    </button>
}