const { exec } = require('child_process')

const URL = 'http://ildaconverter.sidneydouw.de'
const ILDAfile = 'airplane_0.ild'
const watermark = 'watermark_test_2.png'
const watermark_alpha = 1
const resolution = 256
const lineWith = 1
const fps = 25
const fileFormat = 'GIF'
const outputFile = 'test.gif'

exec(
    `curl -X POST ` +
        `-F 'data=@testFiles/${ILDAfile}' ` +
        `-F 'watermark=@testFiles/${watermark}' ` +
        `-F 'resolution=${resolution}' ` +
        `-F 'lineWith=${lineWith}' ` +
        `-F 'fps=${fps}' ` +
        `-F 'fileFormat=${fileFormat}' ` +
        `-F 'watermark_alpha=${watermark_alpha}' ` +
        `http://localhost:3641/convert ` +
        `--output ${outputFile}`,
    (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            console.log(err)
            return
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
    },
)
