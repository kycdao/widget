import styled, { css, StyledComponent } from "styled-components"

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
	font-feature-settings: "liga";
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
	margin-top: 0;
	font-family: "neue-machina";
	-webkit-font-smoothing: antialiased;
`

export const H2 = styled.h2`
	font-family: "neue-machina";
	color: black;
	margin-bottom: 1em;
	color: black;
	-webkit-font-smoothing: antialiased;
`

export const H3 = styled.h3`
	font-family: "neue-machina";
	color: black;
	margin-bottom: 1em;
	color: black;
	-webkit-font-smoothing: antialiased;
`

export const P = styled.p`
	font-size: 12pt;
	color: black;
	margin-bottom: 1em;
	margin-top: 0;
	-webkit-font-smoothing: antialiased;
`

export const Policy = styled(P)`
	font-family: var(--kyc-sdk-primary-font);
	margin-bottom: 1em;
	font-size: 12px;

	a {
		font-size: 12px;
		-webkit-font-smoothing: antialiased;
		color: var(--kyc-sdk-normal-blue);
		text-decoration: underline;
	}

	-webkit-font-smoothing: antialiased;
`

export const Li = styled.li`
	margin-left: 2em;
	font-size: 12pt;
	-webkit-font-smoothing: antialiased;
`

export const Ul = styled.ul`
	padding: 1rem 0;
	width: fit-content;
	-webkit-font-smoothing: antialiased;
`

export const translateX = (x: number | string) => `
	transform: translateX(${x});
`

export const CenteredH1 = styled(H1)`
	text-align: "center";
`
