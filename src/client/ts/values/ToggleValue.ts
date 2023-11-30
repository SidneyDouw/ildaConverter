import Value from './Value'

export default class ToggleValue extends Value {
    value: number

    labelDiv: HTMLElement
    checkboxDiv: HTMLInputElement
    optionDivs: HTMLElement[]

    constructor(el: Element) {
        super(el)

        this.labelDiv = el.children[0].children[0] as HTMLElement
        this.checkboxDiv = el.children[0].children[2].children[0] as HTMLInputElement

        this.value = this.checkboxDiv.checked ? 1 : 0

        this.optionDivs = [el.children[0].children[1] as HTMLElement, el.children[0].children[3] as HTMLElement]

        this.interactions()
    }

    interactions() {
        this.element.onclick = () => {
            // Update Checkbox Indicator
            this.checkboxDiv.indeterminate = false
            this.checkboxDiv.checked = !this.checkboxDiv.checked

            this.valueChange(true)
        }
    }

    setUI(value: number | string) {
        if (typeof value == 'string') {
            this.checkboxDiv.checked = false
            this.checkboxDiv.indeterminate = true
        } else {
            this.checkboxDiv.checked = value == 1 ? true : false
            this.checkboxDiv.indeterminate = false
        }

        this.valueChange(false)
    }

    setValue(value: number) {
        this.setUI(value)
        this.valueChange(true)
    }

    valueChange(triggerChangeEvent: boolean) {
        // Store Previous Value
        this.previousValues.unshift(this.value)
        if (this.previousValues.length > 10) this.previousValues.pop()

        // Update Value
        this.value = this.checkboxDiv.checked ? 1 : 0
        this.value = this.checkboxDiv.indeterminate ? -1 : this.value

        // Update Options Indicator
        for (let i = 0; i < this.optionDivs.length; i++) {
            const opt = this.optionDivs[i]

            if (opt.className.includes('left')) {
                opt.className = 'value left'
            } else {
                opt.className = 'value'
            }

            if (i == this.value) opt.className += ' active'
        }

        if (triggerChangeEvent) {
            this.events.onchange ? this.events.onchange() : null
        }

        // Update Dependants
        for (const d of this.dependants) d.activationFunction()
    }
}
