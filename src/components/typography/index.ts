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

export const text = css`
	color: black;
	font-weight: 400;
	font-size: 12pt;
	line-height: 100%;
	font-family: var(--kyc-sdk-primary-font);
	-webkit-font-smoothing: antialiased;
`

export const smallText = css`
	${text};
	font-size: 12px;
`

export const bold = css`
	${text};
	font-weight: 800;
`

export const H1 = styled.h1<{ marginBottom?: string }>`
	${text};
	margin-bottom: ${({ marginBottom }) => (marginBottom ? marginBottom : "1em")};
	font-size: 1.6rem;
	margin-top: 0;
`

export const H2 = styled.h2`
	${text};
	margin-bottom: 1em;
`

export const H3 = styled.h3`
	${text};
	margin-bottom: 1em;
`

export const P = styled.p`
	${text};
	color: black;
	margin-bottom: 1em;
	margin-top: 0;
	font-weight: 400;
`

export const Policy = styled(P)`
	${smallText}
	margin-bottom: 1em;
`

export const Li = styled.li`
	${text};
	margin-left: 2em;

	${P} {
		margin-bottom: 1em;
	}
`

export const B = styled.b`
	${text};
	margin-bottom: 1em;
	margin-top: 0;
`

export const Ul = styled.ul`
	${text};
	padding: 1rem 0;
	width: fit-content;
	list-style: disc;
`

export const translateX = (x: number | string) => css`
	transform: translateX(${x});
`

export const Centered = css`
	text-align: center;
`

export const CenteredH1 = styled(H1)`
	${Centered}
`

export const Link = styled.a`
	${smallText}
	font-family: var(--light-font);
	text-decoration: underline;
	color: var(--kyc-sdk-dark-blue);
	:visited {
		color: var(--kyc-sdk-dark-blue);
	}
`
