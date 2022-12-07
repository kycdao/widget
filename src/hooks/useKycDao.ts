import { useContext } from "react"
import { KycDaoContext } from "../components/kycDao.provider"

export const useKycDao = () => {
	return useContext(KycDaoContext)
}
