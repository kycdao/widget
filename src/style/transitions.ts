import { css } from "styled-components"

export const transition = css`
	-webkit-transition-property: all;
	-moz-transition-property: all;
	-o-transition-property: all;
	transition-property: all;
`
export const tr2 = css`
	${transition};
	-webkit-transition-duration: 0.2s;
	-moz-transition-duration: 0.2s;
	-o-transition-duration: 0.2s;
	transition-duration: 0.2s;
`
