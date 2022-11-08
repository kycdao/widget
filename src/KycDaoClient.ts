import { SdkConfiguration } from "@kycdao/kycdao-sdk"

export type KycDaoClientMessages = 'kycDaoCloseModal' | 'kycDaoSuccess' | 'kycDaoFail'

export type KycDaoClientMessage = {
    origin: string,
    data: { data: string, type: KycDaoClientMessages }
}

export type KycDaoClientMessageHandler = (message: KycDaoClientMessage) => void

export type KycDaoClientInterface = {
    config: SdkConfiguration
    iframeOptions?: IframeOptions
    width: string
    height: string
    isOpen: boolean
    modal?: HTMLElement
    parent: HTMLElement | string
    isSuccessful: boolean
    onFail?: (reason: string) => void,
    onSuccess?: (data?: string) => void
    open: () => void
    close: () => void
    onOutsideClick: (event: MouseEvent) => void
    messageHndlr: () => KycDaoClientMessageHandler
    getParentElement: () => HTMLElement
}

export type KycDaoClientOptions = {
    width: number | string,
    height: number | string,
    parent: HTMLElement | string,
    config: SdkConfiguration,
    iframeOptions?: IframeOptions,
    onFail?: (reason: string) => void,
    onSuccess?: (data?: string) => void
}

export type IframeOptions = {
    url: string
    messageTargetOrigin: string
}

export default function KycDaoClient(
    this: KycDaoClientInterface, {
        height = "650px",
        width = '400px',
        parent = document.body,
        onFail,
        onSuccess,
        iframeOptions,
        config,
    }: KycDaoClientOptions
) {
    this.config = config
    this.iframeOptions = iframeOptions

    this.width = typeof width === 'string' ? width : `${width}px`
    this.height = typeof height === 'string' ? height : `${height}px`

    this.isOpen = false
    this.parent = parent
    this.onFail = onFail
    this.onSuccess = onSuccess
    this.isSuccessful = false

    this.onOutsideClick = this.onOutsideClick.bind(this)
    this.messageHndlr = this.messageHndlr.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.getParentElement = this.getParentElement.bind(this)
}

KycDaoClient.prototype.onOutsideClick = function (this: KycDaoClientInterface, event: MouseEvent) {
    if (this.modal && !event.composedPath().includes(this.modal as EventTarget)) {
        this.close()
        if (this.onFail) {
            this.onFail('cancelled')
        }
    }
}

KycDaoClient.prototype.messageHndlr = function (this: KycDaoClientInterface, { data: { data, type }, origin }: KycDaoClientMessage) {
    if (!this.iframeOptions && origin === window.location.origin || (this.iframeOptions && origin === this.iframeOptions.messageTargetOrigin)) {
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

KycDaoClient.prototype.getParentElement = function (this: KycDaoClientInterface) {
    if (typeof this.parent === 'string') {
        const parentElement = document.querySelector(this.parent) as HTMLElement | null
        if (!parentElement) {
            throw `There is no such element as '${parent}', check your parent selector string!`
        }

        return parentElement
    }
}

KycDaoClient.prototype.open = function (this: KycDaoClientInterface) {
    if (!this.isOpen) {
        this.parent = this.getParentElement() || document.body

        this.modal = document.createElement('div')
        this.modal.classList.add("KycDaoModal")

        const modalContent = document.createElement('div')
        modalContent.classList.add("KycDaoModalContent")

        const modalBody = document.createElement('div')
        modalBody.className = 'modal-body'
        modalBody.classList.add("KycDaoModalBody")

        const container = this.iframeOptions ? document.createElement('iframe') : document.createElement('div')
        if (this.iframeOptions) {
            const container2 = container as HTMLIFrameElement

            if (!this.iframeOptions.url) {
                throw 'An URL is needed if you want to use an iframe! What do you want to display?'
            }

            container2.allow = "encrypted-media; camera"
            container2.style.border = "border: 0px"
            container2.src = this.iframeOptions.url
            container2.style.width = this.width
            container2.style.height = this.height
        }
        container.classList.add('KycDaoModalIframe')

        modalBody.appendChild(container)
        modalContent.appendChild(modalBody)
        this.modal.appendChild(modalContent)

        this.parent.appendChild(this.modal)
        this.isOpen = true

        window.addEventListener('click', this.onOutsideClick)
        window.addEventListener('message', this.messageHndlr)
        globalThis.BootstrapKycDaoModal({
            config: this.config,
            height: this.height,
            parent: this.modal,
            width: this.width,
            onFail: this.onFail,
            onSuccess: this.onSuccess,
            iframeOptions: this.iframeOptions
        })
    }
}

KycDaoClient.prototype.close = function (this: KycDaoClientInterface) {
    console.log(document.getElementsByClassName('KycDaoModal').item(0))
    if (this.isOpen) {
        if (this.modal) {
            const parentNode = this.getParentElement()

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
