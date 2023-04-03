function getErrorText(error: unknown) {
	if (typeof error === "object" && !(error instanceof Error)) {
		return JSON.stringify(error)
	} else {
		return `${error}`
	}
}

export default getErrorText
