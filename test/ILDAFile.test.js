const { exit } = require('process')
const { readFileSync } = require('fs')
const { join } = require('path')
const ILDAFile = require('../dist/server/shared/ILDAFile').default

/**
 * @param {string} actual
 */

const expect = (actual) => {
    return {
        actual,
        /**
         * @param {string} expected
         */
        toBe: (expected) => {
            if (expected.length !== actual.length) {
                console.log('\nFailed----------------------------------')
                console.log(`  expected length: "${expected.length}"\n  recieved: "${actual.length}"`)
                console.log('----------------------------------------\n')
                exit(1)
            }

            for (let i = 0; i < expected.length; i++) {
                const range = 50
                if (expected[i] !== actual[i]) {
                    console.log('\nFailed----------------------------------')
                    console.log(
                        `  expected: "${expected[i]}" at "${expected.slice(
                            Math.max(0, i - range),
                            Math.min(expected.length - 1, i + range),
                        )}"\n  recieved: "${actual[i]}" at "${actual.slice(
                            Math.max(0, i - range),
                            Math.min(actual.length - 1, i + range),
                        )}"`,
                    )
                    console.log('----------------------------------------\n')
                    exit(1)
                }
            }
        },
    }
}

const test = (name, testFn) => {
    console.log(`\nRunning Test: "${name}"`)
    testFn()
}

const files = [
    // 'airplane_0',
    'batman_0',
    'coupleInLove_5',
    'festiveChampagne_0',
    'heartAndHelix_0',
    'kiss_5',
    'starwars_1',
]

for (const name of files) {
    test(name, () => {
        const ilda_fixture = join(__dirname, `./fixtures/ilda_files/${name}.ild`)
        const json_fixture = join(__dirname, `./fixtures/at_version/6236ee6/json/${name}.json`)

        const expected = readFileSync(json_fixture, 'utf-8')
        const actual = JSON.stringify(new ILDAFile(name, readFileSync(ilda_fixture)))

        expect(actual).toBe(expected)
    })
}
