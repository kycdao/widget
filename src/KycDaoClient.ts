import { SdkConfiguration } from "@kycdao/kycdao-sdk"

export class KycDaoClient {
    modal?: HTMLElement
    isOpen: boolean
    parent: HTMLElement
    messageHndlr: ({ origin, data: { data, type } }: { origin: string, data: { data: any, type: string } }) => void
    onOutsideClick: (event: MouseEvent) => void
    onFail?: (reason: any) => void
    onSuccess?: (data: any) => void
    width: string
    height: string

    constructor(
        width: number | string = 400,
        height: number | string = 650,
        public enabledBlockchainNetworks: SdkConfiguration["enabledBlockchainNetworks"],
        public enabledVerificationTypes: SdkConfiguration["enabledVerificationTypes"],
        parent: HTMLElement | string = document.body,
        public demoMode = true,
        public isIframe: boolean,
        public url?: string,
        public messageTargetOrigin?: string) {

        this.messageTargetOrigin = messageTargetOrigin

        this.width = typeof width === 'string' ? width : `${width}px`
        this.height = typeof height === 'string' ? height : `${height}px`

        if (typeof parent === 'string') {
            const parentElement = document.querySelector(parent) as HTMLElement | null
            if (!parentElement) {
                throw `There is no such element as '${parent}', check your parent selector string!`
            }

            this.parent = parentElement
        } else {
            this.parent = parent
        }

        this.isOpen = false
        // this.result = false
        this.onOutsideClick = (event: MouseEvent) => {
            if (this.modal && !event.composedPath().includes(document.getElementsByClassName('KycDaoModal').item(0) as EventTarget)) {
                this.close()
            }
        }

        this.messageHndlr = ({ origin, data: { data, type } }) => {
            if (origin === this.url) {
                switch (type) {
                    case 'kycDaoCloseModal':
                        this.close()
                        if (this.onFail) {
                            this.onFail('cancelled')
                        }
                        break
                    case 'kycDaoSuccess': {
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
    }

    open = () => {
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

    close = () => {
        if (this.modal) {
            if (this.parent) {
                this.parent.removeChild(this.modal)
            } else {
                document.removeChild(this.modal)
            }
        }

        window.removeEventListener('click', this.onOutsideClick)
        window.removeEventListener('message', this.messageHndlr)
        this.isOpen = false
    }
}
