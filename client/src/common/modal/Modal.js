import { action } from "mobx"
import { getUniqueId } from "../state/uid"

export class Modal {
    id = getUniqueId()

    constructor(manager, options) {
        this.manager = manager
        this.render = options.render
    }

    @action dismiss() {
        this.manager.dismiss(this)
    }
}
