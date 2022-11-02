/// <reference types="react-scripts" />
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
    interface Window {
        ethereum: MetaMaskInpageProvider
    }
    // eslint-disable-next-line no-var
    function BootstrapKycDaoModal(elementSelector: string | HTMLElement, height: number | string, width: number | string,
        demoMode: boolean,
        enabledBlockchainNetworks: SdkConfiguration["enabledBlockchainNetworks"],
        enabledVerificationTypes: SdkConfiguration["enabledVerificationTypes"],
        messageTargetOrigin?: string): void
    class KycDaoClient {
        constructor(
            width: number | string = 400,
            height: number | string = 650,
            public enabledBlockchainNetworks: SdkConfiguration["enabledBlockchainNetworks"],
            public enabledVerificationTypes: SdkConfiguration["enabledVerificationTypes"],
            parent: HTMLElement | string = document.body,
            public demoMode = true,
            public isIframe: boolean,
            public url?: string,
            public messageTargetOrigin?: string)
        open: () => void
        open: () => close
    }
}
