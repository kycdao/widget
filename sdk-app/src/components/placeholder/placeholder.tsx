import { FC } from "react"

import './placeholder.css'

export type PlaceholderProps = {
    width: string
    height: string
}

export const Placeholder: FC<PlaceholderProps> = ({ height, width }) => {
    return <div style={{ width, height }} className="placeholder">
        {width}&times;{height}
    </div>
}