import Value from './Value'

export default class RangeValue extends Value {
    value: number[]

    labelDiv: HTMLElement
    suffixDiv: HTMLElement

    sliderDiv1: HTMLInputElement
    valueDiv1: HTMLInputElement

    sliderDiv2: HTMLInputElement
    valueDiv2: HTMLInputElement

    valueRangeDiv: HTMLElement

    constructor(el: Element) {
        super(el)

        this.labelDiv = el.children[0].children[0] as HTMLElement
        this.suffixDiv = el.children[0].children[5] as HTMLElement

        this.sliderDiv1 = el.children[0].children[2] as HTMLInputElement
        this.valueDiv1 = el.children[0].children[4] as HTMLInputElement
        this.sliderDiv2 = el.children[0].children[6] as HTMLInputElement
        this.valueDiv2 = el.children[0].children[8] as HTMLInputElement

        this.valueRangeDiv = el.children[0].children[10] as HTMLElement

        this.value = [parseFloat(this.valueDiv1.value), parseFloat(this.valueDiv2.value)]

        this.interactions()
    }

    interactions() {
        this.labelDiv.onclick = () => {
            this.valueDiv1.focus()
            this.valueDiv1.select()
        }

        this.sliderDiv1.oninput = () => {
            this.valueDiv1.value = this.sliderDiv1.value

            const diff = this.value[1] - this.value[0]
            this.sliderDiv2.value = parseFloat(this.sliderDiv1.value) + diff + ''
            this.valueDiv2.value = parseFloat(this.sliderDiv1.value) + diff + ''

            this.valueChange(true)
        }

        this.valueDiv1.oninput = () => {
            const v = this.textInputFilter(this.valueDiv1.value)
            this.valueDiv1.value = v + ''

            if (typeof v === 'number') {
                const diff = this.value[1] - this.value[0]
                this.sliderDiv2.value = v + diff + ''
                this.valueDiv2.value = v + diff + ''

                this.valueChange(true)
                this.sliderDiv1.value = v + ''
            }
        }

        this.valueDiv1.onblur = () => {
            this.valueDiv1.value = this.value[0] + ''
        }

        this.sliderDiv2.oninput = () => {
            this.valueDiv2.value = this.sliderDiv2.value
            this.valueChange(true)
        }

        this.valueDiv2.oninput = () => {
            const v = this.textInputFilter(this.valueDiv2.value)
            this.valueDiv2.value = v + ''

            if (typeof v == 'number') {
                this.valueChange(true)
                this.sliderDiv2.value = v + ''
            }
        }

        this.valueDiv2.onblur = () => {
            this.valueDiv2.value = this.value[1] + ''
        }
    }

    setUI(values: number[] | string) {
        if (typeof values == 'string') {
            this.sliderDiv1.value = 'multiple'
            this.valueDiv1.value = 'multiple'
            this.sliderDiv2.value = 'multiple'
            this.valueDiv2.value = 'multiple'
        }
        if (typeof values == 'object') {
            const value1 = values[0] as number
            const value2 = values[1] as number

            this.sliderDiv1.value = value1 + ''
            this.valueDiv1.value = Math.round(value1 * 100) / 100 + ''
            this.sliderDiv2.value = value2 + ''
            this.valueDiv2.value = Math.round(value2 * 100) / 100 + ''
        }

        this.valueChange(false)
    }

    setValue(values: number[]) {
        this.setUI(values)
        this.valueChange(true)
    }

    valueChange(triggerChangeEvent: boolean) {
        // Update Value
        if (this.valueDiv1.value != 'multiple') {
            this.value = [parseFloat(this.valueDiv1.value), parseFloat(this.valueDiv2.value)]
        }

        if (triggerChangeEvent) {
            this.events.onchange ? this.events.onchange() : null
        }

        // Update Dependants
        for (const d of this.dependants) d.activationFunction()

        const values = [...this.value]
        values.sort((a, b) => a - b)

        // Update Value Range Indicator
        if (this.valueDiv1.value == 'multiple') {
            this.valueRangeDiv.textContent = 'multiple ' + this.suffixDiv.textContent
        } else {
            if (values[0] == values[1]) {
                this.valueRangeDiv.textContent = values[0] + ' ' + this.suffixDiv.textContent
            } else {
                this.valueRangeDiv.textContent = values[0] + ' to ' + values[1] + ' ' + this.suffixDiv.textContent
            }
        }
    }
}
