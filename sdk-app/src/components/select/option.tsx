import { FC, PropsWithChildren } from "react"

import './input.component.scss'

export const Option: FC<PropsWithChildren> = ({ children }) => {
    return <div className="kyc-select" >{children}</div>
}