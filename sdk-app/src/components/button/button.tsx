import { FC, PropsWithChildren } from "react"
import './button.scss'

export type ButtonProps = {
    onClick?: () => void
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({ onClick, children }) => {
    return <button className="kyc-button blue" type="button" onClick={onClick}>
        <span>
            {children}
        </span>
        <i className="material-icons arrow"> arrow_forward </i>
    </button>
}