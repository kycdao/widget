import { tr2 } from "@Components/typography"
import { ButtonHTMLAttributes, CSSProperties, forwardRef } from "react"
import styled, { css } from "styled-components/macro"

export type ButtonProps = {
	onClick?: () => void
	className?: string
	disabled?: boolean
	style?: CSSProperties
	children: JSX.Element[] | JSX.Element | string
	inactive?: boolean
	fullWidth?: boolean
	centered?: boolean
	mode: "black" | "green" | "underline" | "clean"
} & ButtonHTMLAttributes<HTMLButtonElement>

const unstyledButton = forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, inactive, fullWidth, onClick, ...rest }, ref) => (
		<button ref={ref} {...rest} onClick={inactive ? undefined : onClick}>
			{children}
		</button>
	)
)

unstyledButton.displayName = "KycDaoButton"

export const Button = styled(unstyledButton)<ButtonProps>`
	height: var(--kyc-sdk-button-height);
	display: inline-flex;
	justify-content: space-between;
	box-sizing: border-box;
	align-items: center;

	position: relative;
	box-shadow: 0 0 0 0 rgba(white, 0);
	background: #ecf0fe;
	color: var(--kyc-sdk-dark-purple);
	border-radius: var(--kyc-sdk-border-radius-light);
	font-size: 12pt;
	cursor: pointer;
	@extend ${tr2};

	${({ fullWidth }) =>
		fullWidth &&
		css`
			width: 100%;
		`}

	span {
		font-family: var(--kyc-sdk-primary-font);
		font-weight: 400;
		font-size: 16px;
		margin-left: 0;
	}

	:disabled {
		background: var(--kyc-sdk-inactive);
		pointer-events: none;
		border: 2px solid black;

		span,
		i {
			color: black;
		}
	}

	${({ mode }) => {
		switch (mode) {
			case "black":
				return css`
					:enabled {
						background: black;
						border: 2px solid black;
					}

					span,
					i {
						font-weight: 400;
						color: white;
					}

					&:hover {
						background: var(--kyc-sdk-cybergreen);
						box-shadow: 0 0 0 0 var(--kyc-sdk-cybergreen-35);

						span,
						i {
							color: black;
						}
					}

					&:focus {
						background: var(--kyc-sdk-cybergreen);
						box-shadow: 0 0 0 5px var(--kyc-sdk-cybergreen-35);

						span,
						i {
							color: black;
						}
					}

					&:active {
						background: var(--darken-green);
						box-shadow: 0 0 0 5px var(--kyc-sdk-cybergreen-35);
					}
				`

			case "green":
				return css`
					background: var(--kyc-sdk-cyberpunk);

					span,
					i {
						font-weight: 400;
						color: white;
					}

					&:hover {
						background: var(--kyc-sdk-cyberpunk);
						box-shadow: 0 0 0 10px var(--kyc-sdk-normal-blue-35);

						span {
							font-weight: 400;
							color: var(--kyc-sdk-dark-blue);
						}
					}

					&:focus {
						background: var(--kyc-sdk-cyberpunk);
						box-shadow: 0 0 0 5px var(--kyc-sdk-cyberpunk-35);
					}

					&:active {
						box-shadow: 0 0 0 5px var(--kyc-sdk-dark-blue-35);
					}
				`

			case "underline":
				return css`
					color: red;
					position: relative;
					display: inline-flex;
					width: max-content;
					border: none;

					&:enabled {
						background: rgb(0, 0, 0, 0);
						color: black;
					}

					&:enabled:after {
						content: "";
						display: inline-flex;
						height: 2px;
						width: 100%;
						background-color: var(--kyc-sdk-cybergreen);
						position: absolute;
						bottom: 6px;
						@extend ${tr2};
					}

					&:disabled:after {
						content: "";
						display: inline-flex;
						height: 2px;
						width: 100%;
						background-color: grey;
						position: absolute;
						bottom: 6px;
					}

					span {
						display: flex;
						align-items: center;
					}

					span:disabled {
						color: grey;
					}

					i:disabled {
						color: grey;
					}

					&:hover {
						:after {
							height: 8px;
						}
					}

					&:disabled {
						background-color: transparent;
						border: none;
						color: grey;
					}
				`
			case "clean":
				return css`
					color: white;
					&:hover {
						background: var(--kyc-sdk-cybergreen);
						box-shadow: 0 0 0 0px var(--kyc-sdk-cybergreen-35);

						span,
						i {
							color: black;
						}
					}
				`
		}
	}}
`
