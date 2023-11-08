import { action, observable } from "mobx"
import { Modal } from "./Modal"

export class ModalManager {
    @observable
    modals = []

    @action spawn(options) {
        this.modals.push(new Modal(this, options))
    }

    @action dismiss(modal) {
        const index = this.modals.indexOf(modal)
        if (index >= 0) this.modals.splice(index, 1)
    }
}
