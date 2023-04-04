import { createGlobalStyle } from "styled-components"
import NeueMachinaRegularBase64 from "../fonts/NeueMachina-Regular"

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'neue-machina';
    src: url(${NeueMachinaRegularBase64}) format('woff2'),
    url(${NeueMachinaRegularBase64}) format('woff');
    font-weight: 400;
    font-style: normal;
  }
`
