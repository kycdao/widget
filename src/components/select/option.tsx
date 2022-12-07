import { FC, PropsWithChildren } from "react"

export const Option: FC<PropsWithChildren> = ({ children }) => {
	return <div className="kyc-select">{children}</div>
}
