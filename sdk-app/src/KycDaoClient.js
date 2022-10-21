export function KycDaoClient(parent, url, width, height) {
    this.parent = parent || document.body
    this.url = url
    this.width = width
    this.height = height
    this.modal = null
}

KycDaoClient.prototype.open = function () {
    if (!this.height) {
        this.height = 650
    }

    if (!this.width) {
        this.width = 400
    }

    this.modal = document.createElement('div')
    this.modal.setAttribute('id', 'KycDaoModal')
    this.modal.className = "modal"

    const modalContent = document.createElement('div')
    this.modal.className = "modal-content"

    const modalBody = document.createElement('div')
    modalBody.className = 'modal-body'

    const iframe = document.createElement('iframe')
    iframe.allow = "encrypted-media; camera"
    iframe.style = "border: 0px"
    iframe.src = this.url
    iframe.width = this.width
    iframe.height = this.height

    modalBody.appendChild(modalContent)
    modalContent.appendChild(modalBody)
    this.modal.appendChild(modalContent)

    this.parent.appendChild(this.modal)
}

KycDaoClient.prototype.close = function () {
    if (this.modal) {
        if (this.parent) {
            this.parent.removeChild(this.modal)
        } else {
            document.removeChild(this.modal)
        }
    }
}

// window.KycDaoClient = KycDaoClient