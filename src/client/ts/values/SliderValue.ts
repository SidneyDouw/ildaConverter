import Value from './Value'

export default class SliderValue extends Value {
    value: number

    labelDiv: HTMLElement
    sliderDiv: HTMLInputElement
    valueDiv: HTMLInputElement

    constructor(el: Element) {
        super(el)

        this.labelDiv = el.children[0].children[0] as HTMLElement
        this.sliderDiv = el.children[0].children[2] as HTMLInputElement
        this.valueDiv = el.children[0].children[4] as HTMLInputElement

        this.value = parseFloat(this.valueDiv.value)

        this.interactions()
    }

    interactions() {
        this.labelDiv.onclick = () => {
            this.valueDiv.focus()
            this.valueDiv.select()
        }

        this.sliderDiv.oninput = () => {
            this.valueDiv.value = this.sliderDiv.value
            this.valueChange(true)
        }

        this.valueDiv.oninput = () => {
            let v = this.textInputFilter(this.valueDiv.value)
            this.valueDiv.value = v + ''

            if (typeof v == 'number') {
                this.valueChange(true)
                this.sliderDiv.value = v + ''
            }
        }

        this.valueDiv.onblur = () => {
            this.valueDiv.value = this.value + ''
        }
    }

    setUI(value: number | string) {
        if (typeof value == 'string') {
            this.sliderDiv.value = 'multiple'
            this.valueDiv.value = 'multiple'
        }
        if (typeof value == 'number') {
            this.sliderDiv.value = value + ''
            this.valueDiv.value = Math.round(value * 100) / 100 + ''
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
        this.value = parseFloat(this.valueDiv.value)

        if (triggerChangeEvent) {
            this.events.onchange ? this.events.onchange() : null
        }

        // Update Dependants
        for (let d of this.dependants) d.activationFunction()
    }
}
