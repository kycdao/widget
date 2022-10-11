import { CSSProperties, FC } from "react"

import './placeholder.css'

export type PlaceholderProps = {
    width: string
    height: string
    onClick?: () => void
    style?: CSSProperties
}

export const Placeholder: FC<PlaceholderProps> = ({ height, width, onClick, style }) => {
    return <div onClick={onClick} style={{ width, height, cursor: onClick ? 'pointer' : 'default', ...style }} className="placeholder">
        {width}&times;{height}
    </div>
}