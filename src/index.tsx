import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style/style.scss';
import './fonts.css';
import './index.css';
import KycDaoModal from './App';
import { BlockchainNetworks, SdkConfiguration, VerificationTypes } from '@kycdao/kycdao-sdk';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorPage } from './pages/ErrorPage';
import "material-icons"

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
