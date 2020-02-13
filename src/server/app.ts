import express from 'express'
import fileupload from 'express-fileupload'

const app = express()


// Pug Setup

app.set('view engine', 'pug')
app.set('views', 'dist/views/dynamic')


// Routes

app.use(express.static('dist/client'))
app.use(fileupload({
    limits: {
        filesize: 8 * 1024 * 1024 * 1
    }
}))

app.post('/upload', (req, res) => {

    if (req.files) {

        let ildaFile: any = req.files.ilda

        let name = ildaFile.name as string
        let data = ildaFile.data as Buffer

        return res.status(200).send({
            message: 'Recieved file ' + name,
            data: data
        })

    } else {

        return res.status(400).send({
            message: 'Error uploading file'
        })

    }

})


app.listen(8082, () => {
    console.log('Server started. Listening on Port 8082')
})