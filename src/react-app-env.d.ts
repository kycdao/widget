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
        protected enabledBlockchainNetworks: SdkConfiguration["enabledBlockchainNetworks"];
        protected enabledVerificationTypes: SdkConfiguration["enabledVerificationTypes"];
        protected parent: HTMLElement | string;
        protected demoMode: boolean;
        protected isIframe: boolean;
        protected url?: string | undefined;
        protected messageTargetOrigin?: string | undefined;
        onFail?: ((reason: string) => void) | undefined;
        onSuccess?: ((data: string | null) => void) | undefined;
        protected modal?: HTMLElement;
        protected isOpen: boolean;
        protected width: string;
        protected height: string;
        get Open(): boolean;
        get Width(): string;
        get Height(): string;
        get EnabledBlockchainNetworks(): ("SolanaDevnet" | "SolanaMainnet" | "SolanaTestnet" | "NearMainnet" | "NearTestnet" | "EthereumGoerli" | "EthereumMainnet" | "PolygonMainnet" | "PolygonMumbai")[] | undefined;
        get EnabledVerificationTypes(): ("KYC" | "AccreditedInvestor")[];
        constructor(enabledBlockchainNetworks: SdkConfiguration["enabledBlockchainNetworks"], enabledVerificationTypes: SdkConfiguration["enabledVerificationTypes"], width?: number | string, height?: number | string, parent?: HTMLElement | string, demoMode?: boolean, isIframe?: boolean, url?: string | undefined, messageTargetOrigin?: string | undefined, onFail?: ((reason: string) => void) | undefined, onSuccess?: ((data: string | null) => void) | undefined);
        protected onOutsideClick: (event: MouseEvent) => void;
        protected messageHndlr: ({ origin, data: { data, type } }: {
            origin: string;
            data: {
                data: string;
                type: 'kycDaoCloseModal' | 'kycDaoSuccess' | 'kycDaoFail';
            };
        }) => void;
        open: () => void;
        close: () => void;
    }
}
