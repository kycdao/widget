import { useKycDao } from "./useKycDao"

export function useVerified() {
	const kycDao = useKycDao()

	return () => {
		if (kycDao) {
			return kycDao.kycDao
				.checkVerificationStatus()
				.then((result) => {
					return Object.entries(result).reduce(
						(prevValue, [, currentValue]) => (currentValue ? true : prevValue),
						false
					)
				})
				.catch((error) => {
					console.log(error)
				})
		} else
			throw new Error(
				"Kycdao should be defined. How this is possyble? Check useVerified()"
			)
	}
}
