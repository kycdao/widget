import { StateContext } from "../../components/stateContext"
import { useCallback, useContext } from "react"
import { useMinting } from "../../hooks/useMinting"
import { Button } from "../button/button"

export const MintingFailedModal = () => {
	const minting = useMinting()
	const {
		data: { subscriptionYears },
	} = useContext(StateContext)

	const onRetry = useCallback(() => {
		minting(subscriptionYears)
	}, [minting, subscriptionYears])

	return (
		<div className="mintingFailedModal">
			<div className="header">
				<i className="material-icons">error</i>
				<p>Minting failed</p>
			</div>

			<div className="body">
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
