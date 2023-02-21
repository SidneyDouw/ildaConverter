import Value from './Value'
import TextValue from './TextValue'
import SliderValue from './SliderValue'
import RangeValue from './RangeValue'
import CheckboxValue from './CheckboxValue'
import ToggleValue from './ToggleValue'

const fn = {
    text: TextValue,
    slider: SliderValue,
    range: RangeValue,
    checkbox: CheckboxValue,
    toggle: ToggleValue,
}

export default class Values {
    values: Value[]

    constructor(parentDiv: HTMLElement) {
        // Initialize all Values

        this.values = []

        Array.from(parentDiv.getElementsByClassName('property')).forEach((el) => {
            const type = el.getAttribute('type')!
            switch (type) {
                case 'text':
                    this.values.push(new fn.text(el))
                    break
                case 'slider':
                    this.values.push(new fn.slider(el))
                    break
                case 'range':
                    this.values.push(new fn.range(el))
                    break
                case 'checkbox':
                    this.values.push(new fn.checkbox(el))
                    break
                case 'toggle':
                    this.values.push(new fn.toggle(el))
                    break
            }
        })

        // Fill dependencies / dependants List
        // Only works after all Values have been initialized

        for (const currentValue of this.values) {
            if (currentValue.dependencyExpressions) {
                const depExp = currentValue.dependencyExpressions.replace(/\s/g, '').split('&&')

                for (const dep of depExp) {
                    const dName = dep.replace(/([\W\d]|false$|true$)/g, '')
                    let dExpression = dep.replace(/\w/g, '')
                    const match = dep.match(/([\d]|false$|true$)/g)
                    let dCheckValue = match && match.length > 0 ? match[0] : ''
                    const dValue = this.find(dName)!

                    if (dExpression == '!') {
                        dExpression = '=='
                        dCheckValue = 'false'
                    }

                    currentValue.dependencies.push({
                        value: dValue,
                        name: dName,
                        expression: dExpression,
                        checkVal: dCheckValue,
                    })
                    dValue.dependants.push(currentValue)
                }

                currentValue.activationFunction()
            }
        }
    }

    find(scriptName: string) {
        for (const value of this.values) {
            if (value.scriptName == scriptName) {
                return value
            }
        }

        console.error('Could not find value with script name "' + scriptName + '"')
    }
}
