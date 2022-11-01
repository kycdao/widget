function KycDaoClient(width, height, parent, isIframe = true, url, messageTargetOrigin) {
    this.messageTargetOrigin = messageTargetOrigin
    this.parent = parent || document.body
    this.url = url
    this.width = width || 400
    this.height = height || 650
    this.modal = null
    this.isOpen = false
    // this.result = false
    this.onOutsideClick = (function (event) {
        if (this.modal && !event.composedPath().includes(document.getElementsByClassName('KycDaoModal').item(0))) {
            this.close()
        }
    }).bind(this)
    this.isIframe = isIframe
    this.messageHndlr = (function ({ origin, data: { data, type } }) {
        if (origin === this.url) {
            switch (type) {
                case 'kycDaoCloseModal':
                    this.close()
                    this.onFail('cancelled')
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
    }).bind(this)
    this.onSuccess = null
    this.onFail = null
}

KycDaoClient.prototype.open = function () {
    this.modal = document.createElement('div')
    this.modal.classList.add("KycDaoModal")

    const modalContent = document.createElement('div')
    modalContent.classList.add("KycDaoModalContent")

    const modalBody = document.createElement('div')
    modalBody.className = 'modal-body'
    modalBody.classList.add("KycDaoModalBody")

    const container = this.isIframe ? document.createElement('iframe') : document.createElement('div')
    container.allow = "encrypted-media; camera"
    container.style = "border: 0px"
    container.src = this.url
    container.width = this.width
    container.height = this.height
    container.classList.add('KycDaoModalIframe')

    modalBody.appendChild(container)
    modalContent.appendChild(modalBody)
    this.modal.appendChild(modalContent)

    if (typeof this.parent === 'string') {
        this.parent = document.querySelector(this.parent)
    }

    this.parent.appendChild(this.modal)
    this.isOpen = true

    setTimeout(() => {
        window.addEventListener('click', this.onOutsideClick)
        window.addEventListener('message', this.messageHndlr)
        if(!this.isIframe) {
            window.BootstrapKycDaoModal(container, this.height, this.width, this.messageTargetOrigin)
        }
    }, 0);
}

KycDaoClient.prototype.close = function () {
    if (this.modal) {
        if (this.parent) {
            this.parent.removeChild(this.modal)
        } else {
            document.removeChild(this.modal)
        }
    }

    window.removeEventListener('click', this.onOutsideClick)
    window.removeEventListener('message', this.closHndlr)
    this.isOpen = false
}