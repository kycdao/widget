import styled, { css } from "styled-components/macro"

export const transition = css`
	transition-property: all;
`
export const tr2 = css`
	${transition};
	transition-duration: 0.2s;
`

export const materialIcon = css`
	font-family: Material Icons;
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
	font-feature-settings: liga;
	-webkit-font-smoothing: antialiased;
`

export const typoBase = css`
	color: black;
	line-height: 100%;
	-webkit-font-smoothing: antialiased;
	font-family: neue-machina;
`

export const H1 = styled.h1<{ marginBottom?: string }>`
	${typoBase};
	margin-bottom: ${({ marginBottom }) => (marginBottom ? marginBottom : "1em")};
	font-size: 1.6rem;
	margin-top: 0;
`

export const H2 = styled.h2`
	${typoBase};
	margin-bottom: 1em;
`

export const H3 = styled.h3`
	${typoBase};
	color: black;
	font-size: 12pt;
	margin-bottom: 1em;
`

export const P = styled.p`
	font-size: 12pt;
	${typoBase};
	color: black;
	margin-bottom: 1em;
	margin-top: 0;
	font-weight: 400;
`

export const Policy = styled(P)`
	font-family: var(--kyc-sdk-primary-font);
	margin-bottom: 1em;
	font-size: 12px;

	-webkit-font-smoothing: antialiased;
`

export const Li = styled.li`
	${typoBase};
	margin-left: 2em;
	font-size: 12pt;

	${P} {
		margin-bottom: 1em;
		${typoBase}
	}
`

export const B = styled.b`
	font-size: 12pt;
	${typoBase};
	margin-bottom: 1em;
	margin-top: 0;
`

export const Ul = styled.ul`
	padding: 1rem 0;
	width: fit-content;
	list-style: disc;
`

export const translateX = (x: number | string) => css`
	transform: translateX(${x});
`

export const CenteredH1 = styled(H1)`
	text-align: center;
`

export const Link = styled.a`
	${typoBase};
	font-family: var(--light-font);
	font-size: 12px;
	text-decoration: underline;
	color: var(--kyc-sdk-dark-blue);
	:visited {
		color: var(--kyc-sdk-dark-blue);
	}
`
