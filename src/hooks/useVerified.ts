import { KycDaoInitializationResult } from "@kycdao/kycdao-sdk"
import { useKycDao } from "./useKycDao"

export async function getVerified(kycDaoState: KycDaoInitializationResult) {
	return Object.entries(
		await kycDaoState.kycDao.checkVerificationStatus()
	).reduce(
		(prevValue, [, currentValue]) => (currentValue ? true : prevValue),
		false
	)
}

export function useVerified() {
	const kycDao = useKycDao()

	if (kycDao) {
		return () => getVerified(kycDao)
	}

	throw new Error("Something happened. You are not supposed to be here.")
}