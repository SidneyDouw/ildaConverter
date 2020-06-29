import Value from './Value'

export default class CheckboxValue extends Value {
    value: boolean

    labelDiv: HTMLElement
    checkboxDiv: HTMLInputElement

    constructor(el: Element) {
        super(el)

        this.labelDiv = el.children[0].children[0] as HTMLElement
        this.checkboxDiv = el.children[0].children[2].children[0] as HTMLInputElement

        this.value = this.checkboxDiv.checked ? true : false

        this.interactions()
    }

    interactions() {
        this.element.onclick = () => {
            this.checkboxDiv.checked = !this.checkboxDiv.checked
            this.checkboxDiv.indeterminate = false

            this.valueChange(true)
        }
    }

    setUI(value: boolean | string) {
        if (typeof value == 'string') {
            this.checkboxDiv.checked = false
            this.checkboxDiv.indeterminate = true
        }
        if (typeof value == 'boolean') {
            this.checkboxDiv.checked = value
            this.checkboxDiv.indeterminate = false
        }
        this.valueChange(false)
    }

    setValue(value: boolean) {
        this.setUI(value)
        this.valueChange(true)
    }

    valueChange(triggerChangeEvent: boolean) {
        // Store Previous Value
        this.previousValues.unshift(this.value)
        if (this.previousValues.length > 10) this.previousValues.pop()

        // Update Value
        this.value = this.checkboxDiv.checked ? true : false

        if (triggerChangeEvent) {
            this.events.onchange ? this.events.onchange() : null
        }

        // Update Dependants
        for (let d of this.dependants) d.activationFunction()
    }
}
