import styled, { css } from "styled-components"

export * from "./transitions"

export const materialIcon = css`
	font-family: "Material Icons";
	font-weight: normal;
	font-style: normal;
	font-size: 24px;
	line-height: 1;
	letter-spacing: normal;
	text-transform: none;
	display: inline-block;
	white-space: nowrap;
	word-wrap: normal;
	direction: ltr;
	-webkit-font-feature-settings: "liga";
	-webkit-font-smoothing: antialiased;
`

export const typoBase = css`
	margin-bottom: 1em;
	font-size: 1.6rem;
	color: black;
`

export const H1 = styled.h1`
	margin-bottom: 1em;
	font-size: 1.6rem;
	color: black;

	font-family: "neue-machina";
`

export const H2 = styled.h2`
	font-family: "neue-machina";
	color: black;
	margin-bottom: 1em;
	color: black;
`

export const H3 = styled.h2`
	font-family: "neue-machina";
	color: black;
	margin-bottom: 1em;
	color: black;
`

export const P = styled.p`
	margin-bottom: 1em;
	font-size: 12pt;
	color: black;
`

export const Policy = styled(P)`
	font-family: var(--kyc-sdk-primary-font);

	a {
		font-size: 12px;
	}
`
