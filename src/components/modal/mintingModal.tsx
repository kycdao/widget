export const MintingModal = () => {
	return (
		<div className="mintingModal">
			<div className="header">
				<i className="material-icons">error</i>
				<p>Mint authorization in progress</p>
			</div>

			<div className="body">
				{/* TODO: KYC-697 && KYC-701  */}
				<p className="policy">
					Your kycNFT is getting ready! Please open your wallet and wait for the
					dialog to confirm the minting transaction
				</p>
			</div>

			<div className="loading-animation">
				<svg
					className="part-1"
					width="43"
					height="26"
					viewBox="0 0 43 26"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M42.701 3.71317L38.9878 0L21.3503 17.6375L16.7088 12.9961L12.9956 16.7092L21.3503 25.0639L42.701 3.71317ZM0 3.71321L9.28292 12.9961L12.9961 9.28296L3.71317 4.60767e-05L0 3.71321Z"
						fill="#3D65F2"
					/>
				</svg>

				<svg
					className="part-2"
					width="43"
					height="26"
					viewBox="0 0 43 26"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M-0.000108705 3.71317L3.71306 0L21.3506 17.6375L25.9921 12.9961L29.7052 16.7092L21.3506 25.0639L-0.000108705 3.71317ZM42.7017 3.71321L33.4187 12.9961L29.7056 9.28296L38.9885 4.35823e-05L42.7017 3.71321Z"
						fill="#3D65F2"
					/>
				</svg>

				<svg
					className="part-3"
					width="43"
					height="26"
					viewBox="0 0 43 26"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M42.701 3.71317L38.9878 0L21.3503 17.6375L16.7088 12.9961L12.9956 16.7092L21.3503 25.0639L42.701 3.71317ZM0 3.71321L9.28292 12.9961L12.9961 9.28296L3.71317 4.60767e-05L0 3.71321Z"
						fill="#3D65F2"
					/>
				</svg>
			</div>
			<h1 className="h1" style={{ justifyContent: "center", display: "flex" }}>
				Loading
			</h1>
		</div>
	)
}
