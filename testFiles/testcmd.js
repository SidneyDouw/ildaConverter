// curl -X POST http://localhost:3641/convert
// curl -X POST -F 'data=@airplane_0.ild' http://localhost:3641/convert --output ../test.gif

const { exec } = require('child_process')

const file = 'airplane_0.ild'
const resolution = 128
const lineWith = 1
const fps = 25
const fileFormat = 'GIF'

exec(
    `curl -X POST -F 'data=@testFiles/${file}' -F 'resolution=${resolution}' -F 'lineWith=${lineWith}' -F 'fps=${fps}' -F 'fileFormat=${fileFormat}' http://localhost:3641/convert --output test.gif`,
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
