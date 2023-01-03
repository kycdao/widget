import { CSSProperties, FC } from "react"

export type PlaceholderProps = {
	width: string
	height: string
	onClick?: () => void
	style?: CSSProperties
	showSize?: boolean
}

export const Placeholder: FC<PlaceholderProps> = ({
	height,
	width,
	onClick,
	style,
	showSize = false,
}) => {
	return (
		<div
			onClick={onClick}
			style={{
				width,
				height,
				cursor: onClick ? "pointer" : "default",
				...style,
			}}
			className="placeholder">
			{showSize ? `${width}&times;${height}` : ""}
		</div>
	)
}
