import Value from './Value'

export default class TextValue extends Value {
    value: number

    labelDiv: HTMLElement
    valueDiv: HTMLInputElement

    constructor(el: Element) {
        super(el)

        this.labelDiv = el.children[0].children[0] as HTMLElement
        this.valueDiv = el.children[0].children[2] as HTMLInputElement

        this.value = parseFloat(this.valueDiv.value)

        this.interactions()
    }

    interactions() {
        this.labelDiv.onclick = () => {
            this.valueDiv.focus()
            this.valueDiv.select()
        }

        this.valueDiv.oninput = (evt) => {
            let v = this.textInputFilter(this.valueDiv.value)
            this.valueDiv.value = v + ''

            if (typeof v == 'number') {
                this.valueChange(true)
            }
        }

        this.valueDiv.onblur = () => {
            this.valueDiv.value = this.value + ''
        }
    }

    setUI(value: number | string) {
        if (typeof value === 'string') {
            this.valueDiv.value = value
        }
        if (typeof value === 'number') {
            this.valueDiv.value = Math.round(value * 100) / 100 + ''
        }
        this.valueChange(false)
    }

    setValue(value: number | string) {
        this.setUI(value)
        this.valueChange(true)
    }

    valueChange(triggerChangeEvent: boolean) {
        // Store Previous Value
        this.previousValues.unshift(this.value)
        if (this.previousValues.length > 10) this.previousValues.pop()

        // Update Value
        this.value = parseFloat(this.valueDiv.value)

        if (triggerChangeEvent) {
            this.events.onchange ? this.events.onchange() : null
        }

        // Update Dependants
        for (let d of this.dependants) d.activationFunction()
    }
}
