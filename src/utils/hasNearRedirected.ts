const knownNearQueryParams = {
	account_id: "NearLogin",
	errorCode: "NearUserRejectedError",
	transactionHashes: "NearMint",
}

const hasNearRedirected = (params: string): boolean => {
	const queryParams = new URLSearchParams(params)

	for (const [key, event] of Object.entries(knownNearQueryParams)) {
		const value = queryParams.get(key)
		if (value && event.startsWith("Near")) {
			return true
		}
	}

	return false
}

export default hasNearRedirected