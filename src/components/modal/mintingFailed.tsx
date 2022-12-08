import { useCallback } from "react"
import { useMinting } from "../../hooks/useMinting"
import { Button } from "../button/button"

export const MintingFailedModal = () => {
	const minting = useMinting()

	const onRetry = useCallback(() => {
		minting()
	}, [minting])

	return (
		<div className="mintingFailedModal">
			<div className="header">
				<i className="material-icons">error</i>
				<p>Minting failed</p>
			</div>

			<div className="e-mail-address">
				<p className="policy">
					Minting failed because of an error. Please try mint kycNFT again.
				</p>
			</div>

			<Button className="underline centered" onClick={onRetry}>
				<>
					<i className="material-icons">refresh</i>
					<span>Retry</span>
				</>
			</Button>
		</div>
	)
}
