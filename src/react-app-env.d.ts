/// <reference types="react-scripts" />
import { SdkConfiguration } from "@kycdao/kycdao-sdk";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { IframeOptions } from './KycDaoClient'

declare global {
    interface Window {
        ethereum: MetaMaskInpageProvider
    }
    // eslint-disable-next-line no-var
    function BootstrapKycDaoModal(
        config: {
            width: number | string,
            height: number | string,
            parent: HTMLElement | string,
            config: SdkConfiguration,
            iframeOptions?: IframeOptions,
            onFail?: (reason: string) => void,
            onSuccess?: (data?: string) => void
        }): void
    function KycDaoClient(KycDaoClientOptions)
}
