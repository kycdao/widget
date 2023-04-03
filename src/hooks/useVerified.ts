import { KycDaoInitializationResult } from "@kycdao/kycdao-sdk"
import { useKycDao } from "./useKycDao"

export function isVerified(kycDao: KycDaoInitializationResult) {
	return kycDao.kycDao
		.checkVerificationStatus()
		.then((result) => {
			return Object.entries(result).reduce(
				(prevValue, [, currentValue]) => (currentValue ? true : prevValue),
				false
			)
		})
		.catch((error) => {
			console.error(error)
		})
}

export function useVerified() {
	const kycDao = useKycDao()

	return () => {
		if (kycDao) {
			return isVerified(kycDao)
		} else
			throw new Error(
				"Kycdao should be defined. How this is possyble? Check useVerified()"
			)
	}
}
