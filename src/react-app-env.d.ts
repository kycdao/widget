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
        enabledBlockchainNetworks: SdkConfiguration["enabledBlockchainNetworks"];
        enabledVerificationTypes: SdkConfiguration["enabledVerificationTypes"];
        demoMode: boolean;
        isIframe: boolean;
        url?: string | undefined;
        messageTargetOrigin?: string | undefined;
        modal?: HTMLElement;
        isOpen: boolean;
        parent: HTMLElement;
        messageHndlr: ({ origin, data: { data, type } }: {
            origin: string;
            data: {
                data: any;
                type: string;
            };
        }) => void;
        onOutsideClick: (event: MouseEvent) => void;
        onFail?: (reason: any) => void;
        onSuccess?: (data: any) => void;
        width: string;
        height: string;
        constructor(width: string | number | undefined, height: string | number | undefined, enabledBlockchainNetworks: SdkConfiguration["enabledBlockchainNetworks"], enabledVerificationTypes: SdkConfiguration["enabledVerificationTypes"], parent: string | HTMLElement | undefined, demoMode: boolean, isIframe: boolean, url?: string | undefined, messageTargetOrigin?: string | undefined);
        open: () => void;
        close: () => void;
    }
}
