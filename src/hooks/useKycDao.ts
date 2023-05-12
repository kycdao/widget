import { KycDaoContext } from "@Components/kycDao.provider"
import { useContext } from "react"

export const useKycDao = () => {
  return useContext(KycDaoContext)
}
