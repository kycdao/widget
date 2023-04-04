import { render, screen } from '@testing-library/react';
import { KycDaoWidget } from "./KycDaoWidget";
import { BlockchainNetworks, SdkConfiguration, VerificationTypes } from "@kycdao/kycdao-sdk";

test('renders account balance', async () => {
  const config: SdkConfiguration = {
    demoMode: true,
    enabledBlockchainNetworks: [BlockchainNetworks.PolygonMumbai],
    enabledVerificationTypes: [VerificationTypes.KYC],
    baseUrl: "https://staging.kycdao.xyz",
    evmProvider: {},
  }

  render(<KycDaoWidget config={config} />)

  screen.logTestingPlaygroundURL()

  expect(await screen.findByText('Loading')).toBeInTheDocument();
});