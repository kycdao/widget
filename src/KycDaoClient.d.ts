import { SdkConfiguration } from "@kycdao/kycdao-sdk";
export declare type KycDaoClientMessages = 'kycDaoCloseModal' | 'kycDaoSuccess' | 'kycDaoFail';
export declare type KycDaoClientMessage = {
    origin: string;
    data: {
        data: string;
        type: KycDaoClientMessages;
    };
};
export declare type KycDaoClientMessageHandler = (message: KycDaoClientMessage) => void;
export declare type KycDaoClientInterface = {
    config: SdkConfiguration;
    iframeOptions?: IframeOptions;
    width: string;
    height: string;
    isOpen: boolean;
    modal?: HTMLElement;
    parent: HTMLElement | string;
    isSuccessful: boolean;
    onFail?: (reason: string) => void;
    onSuccess?: (data?: string) => void;
    open: () => void;
    close: () => void;
    onOutsideClick: (event: MouseEvent) => void;
    messageHndlr: () => KycDaoClientMessageHandler;
};
export declare type KycDaoClientOptions = {
    width: number | string;
    height: number | string;
    parent: HTMLElement | string;
    config: SdkConfiguration;
    iframeOptions?: IframeOptions;
    onFail?: (reason: string) => void;
    onSuccess?: (data?: string) => void;
};
export declare type IframeOptions = {
    url: string;
    messageTargetOrigin: string;
};
export default function KycDaoClient(this: KycDaoClientInterface, { height, width, parent, onFail, onSuccess, iframeOptions, config, }: KycDaoClientOptions): void;
//# sourceMappingURL=KycDaoClient.d.ts.map