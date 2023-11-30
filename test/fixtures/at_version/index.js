/**
 * Generate `ILDAFiles` from the .ild files at `test/fixtures/ilda_files` using the code
 * from the available versions. Then write them out as JSON to create fixtures that we can
 * test against.
 */

const { readFile, writeFile, readdir } = require('fs/promises')
const { existsSync, mkdirSync } = require('fs')
const { join } = require('path')

const files = [
    'airplane_0',
    'batman_0',
    'coupleInLove_5',
    'festiveChampagne_0',
    'heartAndHelix_0',
    'kiss_5',
    'starwars_1',
]

const getDirectories = async (path) =>
    (await readdir(path, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name)

const generate_files_for_version = (version) => {
    const ILDAFile = require(`./${version}/dist/server/shared/ILDAFile`).default
    const converter = require('./6236ee6/dist/server/converter/converter').default

    const jsonFolder = join(__dirname, `./${version}/json`)
    const gifFolder = join(__dirname, `./${version}/gif`)

    if (!existsSync(jsonFolder)) {
        mkdirSync(jsonFolder)
    }
    if (!existsSync(gifFolder)) {
        mkdirSync(gifFolder)
    }

    for (const name of files) {
        const filename = join(__dirname, `../ilda_files/${name}.ild`)

        readFile(filename).then((data) => {
            const file = new ILDAFile(name, data)
            writeFile(join(jsonFolder, `/${name}.json`), JSON.stringify(file))

            converter(
                file.pointData,
                {
                    resolution: 512,
                    lineWidth: 1,
                    fps: 25,
                    fileFormat: 'GIF',
                },
                (data) => {
                    writeFile(join(gifFolder, `/${name}.gif`), data)
                },
            )
        })
    }
}

getDirectories(__dirname).then((dirs) => dirs.forEach((dir) => generate_files_for_version(dir)))
