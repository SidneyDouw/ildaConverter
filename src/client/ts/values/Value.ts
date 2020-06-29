interface dependency {
    value: Value
    name: string
    expression: string
    checkVal: string
}

export default class Value {
    value: any
    previousValues: any[]

    element: HTMLElement

    scriptName: string
    label: string

    type: string

    dataType: string

    // Initial string input from pug
    dependencyExpressions: string
    // Values that this Value is dependant on
    dependencies: dependency[]
    // Values that have a dependency to this Value
    dependants: Value[]

    disabled: boolean

    events: any

    constructor(el: Element) {
        this.previousValues = []

        this.element = el as HTMLElement

        this.scriptName = el.getAttribute('name')
        this.label = el.children[0].children[0].textContent

        this.type = el.getAttribute('type')

        this.dataType = el.getAttribute('dataType')

        this.dependencies = []
        this.dependants = []

        if (el.getAttribute('dependencies')) {
            this.dependencyExpressions = el.getAttribute('dependencies')
        }

        this.disabled = false

        this.events = {}
    }

    activationFunction() {
        if (this.dependencies.length <= 0) return

        let boolFlag = true

        for (let d of this.dependencies) {
            if (d.value.disabled) {
                this.disableValue(true)
                return
            }

            if (!eval('(' + d.value.value + d.expression + d.checkVal + ')')) {
                boolFlag = false
            }
        }

        this.disableValue(!boolFlag)

        for (let d of this.dependants) d.activationFunction()
    }

    disableValue(check: boolean) {
        this.disabled = check
        this.element.className = check ? 'property disabled' : 'property'
    }

    textInputFilter(input: string, dataType?: string) {
        let output: string
        let type: string

        type = dataType ? dataType : this.dataType

        switch (type) {
            case 'float':
                output = input.match(/-?\d*[\.\,]?\d*/g)[0]
                break

            case 'uFloat':
                output = input.match(/\d*[\.\,]?\d*/g)[0]
                break

            case 'int':
                output = input.match(/-?\d*/g)[0]
                break

            case 'uInt':
                output = input.match(/\d*/g)[0]
                break

            default:
                console.error('Data Type not defined / found', type)
        }

        output = output.replace(',', '.')

        if (isNaN(parseFloat(output)) || output == '-0' || output.match(/-?\d+\.0*$/g)) {
            // console.log('returning string', output)
            return output
        } else {
            // console.log('returning number', parseFloat(output))
            return parseFloat(output)
        }
    }

    on(event: string, func: Function) {
        this.events['on' + event] = func.bind(this)
    }

    setUI(value: any) {}
}
