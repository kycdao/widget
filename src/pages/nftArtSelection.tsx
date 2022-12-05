import { useContext, useState, useCallback, FC, useEffect } from "react"
import { Button } from "../components/button/button"
import { KycDaoContext } from "../components/kycDao.provider"
import {
	StateContext,
	DataActionTypes,
	StepID,
	HeaderButtons,
	OnPrev,
} from "../components/stateContext"
import { StepPart, Step } from "../components/step/step"
import { PageProps } from "./pageProps"

const Header = () => (
	<h1 className="h1">
		<span className="logo">
			<svg
				width="16"
				height="21"
				viewBox="0 0 16 21"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M16.0007 1.39121L14.6095 0L8.00129 6.60825L6.26227 4.86924L4.87106 6.26045L8.00129 9.39067L16.0007 1.39121ZM0.00195312 1.39146L3.47998 4.86948L4.87119 3.47827L1.39316 0.00024517L0.00195312 1.39146Z"
					fill="black"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M15.9982 12.9811L14.607 11.5898L7.99872 18.1981L6.25971 16.4591L4.8685 17.8503L7.99872 20.9805L15.9982 12.9811ZM0 12.9817L3.47803 16.4598L4.86924 15.0686L1.39121 11.5905L0 12.9817Z"
					fill="black"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M15.999 7.07871L12.521 10.5567L11.1298 9.16553L14.6078 5.6875L15.999 7.07871ZM0.000940445 7.07903L1.39215 5.68782L8.0004 12.2961L9.73941 10.5571L11.1306 11.9483L8.0004 15.0785L0.000940445 7.07903Z"
					fill="black"
				/>
			</svg>
		</span>
		Select your KYC NFT art
	</h1>
)

type Nft = {
	id: string
	url: string
}

export const NftSelection: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const { dispatch } = useContext(StateContext)
	const kycDao = useContext(KycDaoContext)

	const [nftImages, setNftImages] = useState<Nft[]>([])

	useEffect(() => {
		kycDao?.kycDao.getNftImageOptions().then((options) => {
			const images = [] as Nft[]

			Object.entries(options).forEach(([, url]) => {
				const splitUrl = url.split("/")

				if (splitUrl.length > 0) {
					const id = splitUrl[splitUrl.length - 1]

					images.push({ url: url + "?timestamp=" + Date.now().toString(), id })
					setNftImages(images)
				}
			})
		})
	}, [kycDao])

	const onSubmit = useCallback(
		(id: string) => () => {
			dispatch({ type: DataActionTypes.nftImageChange, payload: id })
			dispatch({
				type: DataActionTypes.changePage,
				payload: {
					current: StepID.mintStep,
					prev: StepID.nftArtSelection,
				},
			})
		},
		[dispatch]
	)

	const onPrev = useCallback(() => {
		dispatch({
			type: DataActionTypes.changePage,
			payload: {
				current: StepID.taxResidenceStep,
				next: StepID.nftArtSelection,
			},
		})
	}, [dispatch])

	useEffect(() => {
		if (!disabled && !inactive) {
			const prev = OnPrev.subscribe(onPrev)

			return () => {
				prev.unsubscribe()
			}
		}
	}, [disabled, inactive, onPrev])

	const onTransitionDone = useCallback(() => {
		if (!disabled && !inactive) {
			dispatch({
				payload: { button: HeaderButtons.prev, state: "enabled" },
				type: DataActionTypes.SetHeaderButtonState,
			})
			dispatch({
				payload: { button: HeaderButtons.next, state: "hidden" },
				type: DataActionTypes.SetHeaderButtonState,
			})
		}
	}, [disabled, inactive, dispatch])

	const onRegenerate = useCallback(() => {
		kycDao?.kycDao.regenerateNftImageOptions().then((options) => {
			const images = [] as Nft[]

			Object.entries(options).forEach(([, url]) => {
				const splitUrl = url.split("/")

				if (splitUrl.length > 0) {
					const id = splitUrl[splitUrl.length - 1]

					images.push({
						url: url + "?timestamp=" + Date.now(),
						id,
					})
					setNftImages(images)
				}
			})
		})
	}, [kycDao?.kycDao])

	const body = useCallback<StepPart>(
		({ disabled, inactive }) => (
			<>
				<div className="nft-image-wrapper">
					{nftImages.map((image) => {
						return (
							<div
								className="nft-image"
								key={image.id}
								onClick={onSubmit(image.id)}>
								<img alt="Nft" src={image.url} />
							</div>
						)
					})}
				</div>

				<div className="nft-button-wrapper">
					<Button
						inactive={inactive}
						disabled={disabled}
						className="full-width underline centered"
						onClick={onRegenerate}>
						<>
							<i className="material-icons">refresh</i>
							<span>regenerate</span>
						</>
					</Button>
				</div>
			</>
		),
		[onRegenerate, nftImages, onSubmit]
	)

	if (!kycDao) {
		return <>Error</>
	}

	return (
		<Step
			onPrev={onPrev}
			inactive={inactive}
			disabled={disabled}
			onTransitionDone={onTransitionDone}
			animation={animation}
			className={className}
			header={Header}
			body={body}
		/>
	)
}
