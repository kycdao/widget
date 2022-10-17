import React from 'react';
import { createRoot } from 'react-dom/client';
import './style/style.scss';
import KycDaoModal from './App';
import { BlockchainNetworks, VerificationTypes } from '@kycdao/kycdao-sdk';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorPage } from './pages/ErrorPage';

export function BootstrapKycDaoModal(element: string | HTMLElement, height: number | string, width: number | string) {
  const root = createRoot(
    typeof element === 'string' ? document.querySelector(element) as HTMLElement : element
  )
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <KycDaoModal baseUrl="https://staging.kycdao.xyz"
          enabledBlockchainNetworks={[BlockchainNetworks.NearTestnet, BlockchainNetworks.PolygonMumbai]}
          enabledVerificationTypes={[VerificationTypes.KYC]}
          demoMode
          evmProvider={window.ethereum}
          height={height}
          width={width}
        />
      </ErrorBoundary>
    </React.StrictMode>
  )
}

globalThis.BootstrapKycDaoModal = BootstrapKycDaoModal
