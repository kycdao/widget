import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style/style.scss';
import './index.css';
import KycDaoModal from './App';
import { BlockchainNetworks, SdkConfiguration, VerificationTypes } from '@kycdao/kycdao-sdk';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorPage } from './pages/ErrorPage';
import buffer from 'buffer';

new FontFace('gilroyRegular', 'url(fonts/ITCAvantGardePro-Book.woff2)').load().then((f) => document.fonts.add(f)).catch(console.error)
new FontFace('gilroyRegular', 'url(fonts/Gilroy-Regular.woff2)').load().then((f) => document.fonts.add(f)).catch(console.error)
new FontFace('gilroyLight', 'url(fonts/Gilroy-Light.woff2)').load().then((f) => document.fonts.add(f)).catch(console.error)
new FontFace('Pacifico', 'url(fonts/Gilroy-ExtraBold.woff2)').load().then((f) => document.fonts.add(f)).catch(console.error)

new FontFace('Material Icons', 'url(https://fonts.gstatic.com/s/materialicons/v139/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2)', {
  style: 'normal',
  weight: '400',
}).load().then((f) => document.fonts.add(f)).catch(console.error)

// don't know why this stopped working, so I do a manual polyfill
if(!window.Buffer) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).Buffer = (buffer as any).Buffer
}

export default function BootstrapKycDaoModal(element: string | HTMLElement,
  height: number | string,
  width: number | string,
  demoMode = true,
  enabledBlockchainNetworks: SdkConfiguration["enabledBlockchainNetworks"] = [BlockchainNetworks.NearTestnet, BlockchainNetworks.PolygonMumbai, BlockchainNetworks.SolanaDevnet],
  enabledVerificationTypes: SdkConfiguration["enabledVerificationTypes"] = [VerificationTypes.KYC],
  messageTargetOrigin?: string) {
  const root = createRoot(
    typeof element === 'string' ? document.querySelector(element) as HTMLElement : element
  )

  root.render(
    <StrictMode>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <KycDaoModal baseUrl="https://staging.kycdao.xyz"
          enabledBlockchainNetworks={enabledBlockchainNetworks}
          enabledVerificationTypes={enabledVerificationTypes}
          demoMode={demoMode}
          evmProvider={window.ethereum}
          height={height}
          width={width}
          messageTargetOrigin={messageTargetOrigin}
        />
      </ErrorBoundary>
    </StrictMode>
  )
}

globalThis.BootstrapKycDaoModal = BootstrapKycDaoModal
