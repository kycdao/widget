import { useContext } from "react"
import { KycDaoContext } from "@Components/kycDao.provider"

export const useKycDao = () => {
	return useContext(KycDaoContext)
}
