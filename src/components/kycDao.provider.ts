import { createContext } from "react"
import { KycDaoInitializationResult } from "@kycdao/kycdao-sdk"

export const KycDaoContext = createContext<
  KycDaoInitializationResult | undefined
>(undefined)
