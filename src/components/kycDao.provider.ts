import { createContext } from "react"
import { KycDaoInitializationResult } from "@kycdao/kycdao-sdk"

export type KycDaoState = KycDaoInitializationResult & {
	width?: number | string
	height?: number | string
	grantFlowEnabled?: boolean
}

export const KycDaoContext = createContext<KycDaoState | undefined>(undefined)
