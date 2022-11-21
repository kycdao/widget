import { useContext, useCallback, useState, useEffect, FC } from "react"
import { Step, StepPart } from "../components/step/step"
import { Button } from "../components/button/button"
import { KycDaoContext } from "../components/kycDao.provider"
import { Placeholder } from "../components/placeholder/placeholder"
import {
	DataActionTypes,
	HeaderButtons,
	StateContext,
} from "../components/stateContext"
import { PageProps } from "./pageProps"

const Header = () => <h1>Congrats!</h1>

export const FinalStep: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	// inactive = false,
}) => {
	const kycDao = useContext(KycDaoContext)
	const {
		dispatch,
		data: { messageTargetOrigin },
	} = useContext(StateContext)

	const onTransitionDone = useCallback(() => {
		if (!disabled) {
			dispatch({
				payload: { button: HeaderButtons.prev, state: "hidden" },
				type: DataActionTypes.SetHeaderButtonState,
			})
			dispatch({
				payload: { button: HeaderButtons.next, state: "hidden" },
				type: DataActionTypes.SetHeaderButtonState,
			})
		}
	}, [disabled, dispatch])

	const [nftImageUrl, setNftImageUrl] = useState("")

	const onCheck = useCallback(() => {
		// dispatch({ type: DataActionTypes.nexPage, payload: StepID.finalStep })
	}, [])

	useEffect(() => {
		if (kycDao) {
			window.parent.postMessage(
				{ type: "kycDaoSuccess" },
				messageTargetOrigin || window.location.origin
			)
			setNftImageUrl(kycDao.kycDao.getNftImageUrl())
		}
	}, [messageTargetOrigin, kycDao])

	const body = useCallback<StepPart>(
		(props) => (
			<>
				<h1 style={{ textAlign: "center" }}>
					You have successfully minted your kycNFT on{" "}
					{kycDao?.kycDao.connectedWallet?.blockchainNetwork}
				</h1>
				<div style={{ display: "flex", justifyContent: "center" }}>
					{nftImageUrl ? (
						<img alt="" src={nftImageUrl} width="300px" height="300px" />
					) : (
						<Placeholder width="300px" height="300px" />
					)}
				</div>
				<Button
					{...props}
					className="full-width underline centered"
					onClick={onCheck}>
					Check on chain
				</Button>
			</>
		),
		[kycDao, nftImageUrl, onCheck]
	)

	if (!kycDao) {
		return <>error</>
	}

	return (
		<Step
			onTransitionDone={onTransitionDone}
			disabled={disabled}
			animation={animation}
			className={className}
			header={Header}
			body={body}></Step>
	)
}
