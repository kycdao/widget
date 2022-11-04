import { SdkConfiguration } from "@kycdao/kycdao-sdk"

export type KycDaoClientMessages = 'kycDaoCloseModal' | 'kycDaoSuccess' | 'kycDaoFail'

export type KycDaoClientInterface = {
    messageTargetOrigin?: string
    width: string
    height: string
    isOpen: boolean
    modal?: HTMLElement
    parent: HTMLElement | string
    enabledBlockchainNetworks: SdkConfiguration["enabledBlockchainNetworks"]
    enabledVerificationTypes: SdkConfiguration["enabledVerificationTypes"]
    isIframe: boolean
    demoMode: boolean
    isSuccessful: boolean
    onFail?: (reason: string) => void,
    onSuccess?: (data: string | null) => void
    url?: string
    open: () => void
    close: () => void
    onOutsideClick: (event: MouseEvent) => void
    messageHndlr: ({ origin, data: { data, type } }: { origin: string, data: { data: string, type: KycDaoClientMessages } }) => void
}

export type KycDaoClientOptions = {
    enabledBlockchainNetworks: SdkConfiguration["enabledBlockchainNetworks"],
    enabledVerificationTypes: SdkConfiguration["enabledVerificationTypes"],
    width: number | string,
    height: number | string,
    parent: HTMLElement | string,
    demoMode: boolean,
    isIframe: boolean,
    url?: string,
    messageTargetOrigin?: string,
    onFail?: (reason: string) => void,
    onSuccess?: (data: string | null) => void
}

export default function KycDaoClient(
    this: KycDaoClientInterface, {
        demoMode,
        enabledBlockchainNetworks,
        enabledVerificationTypes,
        height = "400px",
        width = '650px',
        isIframe = true,
        parent = document.body,
        messageTargetOrigin,
        onFail,
        onSuccess,
        url
    }: KycDaoClientOptions
) {
    this.messageTargetOrigin = messageTargetOrigin

    this.width = typeof width === 'string' ? width : `${width}px`
    this.height = typeof height === 'string' ? height : `${height}px`

    this.isOpen = false
    this.enabledBlockchainNetworks = enabledBlockchainNetworks
    this.enabledVerificationTypes = enabledVerificationTypes
    this.demoMode = demoMode
    this.isIframe = isIframe
    this.parent = parent
    this.onFail = onFail
    this.onSuccess = onSuccess
    this.url = url
    this.isSuccessful = false

    this.onOutsideClick = this.onOutsideClick.bind(this)
    this.messageHndlr = this.messageHndlr.bind(this)
}

KycDaoClient.prototype.onOutsideClick = function (this: KycDaoClientInterface, event: MouseEvent) {
    if (this.modal && !event.composedPath().includes(document.getElementsByClassName('KycDaoModal').item(0) as EventTarget)) {
        this.close()
        if (this.onFail) {
            this.onFail('cancelled')
        }
    }
}

KycDaoClient.prototype.messageHndlr = function (this: KycDaoClientInterface, { origin, data: { data, type } }: { origin: string, data: { data: string, type: KycDaoClientMessages } }) {
    if (this.url ? origin === this.url : true) {
        switch (type) {
            case 'kycDaoCloseModal':
                if (this.onFail) {
                    this.onFail('cancelled')
                }
                if (this.isOpen) {
                    this.close()
                }
                break
            case 'kycDaoSuccess': {
                this.isSuccessful = true
                if (this.onSuccess) {
                    this.onSuccess(data)
                }
            }
                break
            case 'kycDaoFail': {
                if (this.onFail) {
                    this.onFail(data)
                }
            }
        }
    }
}

KycDaoClient.prototype.open = function (this: KycDaoClientInterface) {
    if (!this.isOpen) {
        if (typeof this.parent === 'string') {
            const parentElement = document.querySelector(this.parent) as HTMLElement | null
            if (!parentElement) {
                throw `There is no such element as '${this.parent}', check your parent selector string!`
            }

            this.parent = parentElement
        }

        this.modal = document.createElement('div')
        this.modal.classList.add("KycDaoModal")

        const modalContent = document.createElement('div')
        modalContent.classList.add("KycDaoModalContent")

        const modalBody = document.createElement('div')
        modalBody.className = 'modal-body'
        modalBody.classList.add("KycDaoModalBody")

        const container = this.isIframe ? document.createElement('iframe') : document.createElement('div')
        if (this.isIframe) {
            const container2 = container as HTMLIFrameElement

            if (!this.url) {
                throw 'An URL is needed if you want to use an iframe! What do you want to display?'
            }

            container2.allow = "encrypted-media; camera"
            container2.style.border = "border: 0px"
            container2.src = this.url
            container2.style.width = this.width
            container2.style.height = this.height
        }
        container.classList.add('KycDaoModalIframe')

        modalBody.appendChild(container)
        modalContent.appendChild(modalBody)
        this.modal.appendChild(modalContent)

        this.parent.appendChild(this.modal)
        this.isOpen = true

        setTimeout(() => {
            window.addEventListener('click', this.onOutsideClick)
            window.addEventListener('message', this.messageHndlr)
            if (!this.isIframe) {
                globalThis.BootstrapKycDaoModal(
                    container,
                    this.height,
                    this.width,
                    this.demoMode,
                    this.enabledBlockchainNetworks,
                    this.enabledVerificationTypes,
                    this.messageTargetOrigin)
            } else {
                globalThis.BootstrapKycDaoModal(
                    container,
                    this.height,
                    this.width,
                    this.demoMode,
                    this.enabledBlockchainNetworks,
                    this.enabledVerificationTypes,
                    this.messageTargetOrigin)
            }
        }, 0);
    }
}

KycDaoClient.prototype.close = function (this: KycDaoClientInterface) {
    if (this.isOpen) {
        if (this.modal) {
            const parentNode = typeof this.parent !== 'string' ? this.parent : document.querySelector(this.parent)

            if (parentNode) {
                parentNode.removeChild(this.modal)
            }
        }

        window.removeEventListener('click', this.onOutsideClick)
        window.removeEventListener('message', this.messageHndlr)
        this.isOpen = false
    }
}

global.KycDaoClient = KycDaoClient
