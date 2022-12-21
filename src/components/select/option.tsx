import { FC, PropsWithChildren } from "react"

export const Option: FC<PropsWithChildren> = ({ children }) => {
	return <div className="kyc-sdk-select">{children}</div>
}
