// import express from 'express'

// import fs from 'fs'
// import fileupload from 'express-fileupload'

// import readIldaFile from  './readFile'
// import createImage from  './createImage'

// const app = express()

// // Pug Setup

// app.set('view engine', 'pug')
// app.set('views', 'dist/views/dnamic/')

// // Routes

// app.use(express.static('dist/client'))
// app.use(fileupload({
// 	limits: {
// 		filesize: 8*1024*1024*10
// 	}
// }))

// // app.get('/dynamic', (req, res) => {

// // 	let buildVersion = fs.readFileSync('./gulpconfig/buildVersion', 'utf-8')

// // 	res.render('dynamic', {
// // 		buildVersion: buildVersion
// // 	})

// // })

// app.post('/convert', (req, res) => {

// 	let files = req.files as any

// 	if (req.files) {

// 		let fileName = files.ilda.name as string
// 		let fileSize = files.ilda.size as number
// 		let bufferData = files.ilda.data as Buffer

// 		readIldaFile(bufferData, (err, drawData) => {
			
// 			if (err) {

// 				return res.status(400).send({
// 					message: err
// 				})
				
// 			}
			
// 			// createImage(drawData, () => {

// 			// 	res.status(200).download('test.gif', (err) => {
					
// 			// 		if (err) {
// 			// 			console.log(err)
// 			// 			return
// 			// 		}
					
// 			// 		fs.unlinkSync('test.gif')
					
// 			// 	})
// 			// })
// 		})

// 	} else {

// 		return res.status(400).send({
// 			message: 'something went wrong with the upload'
// 		})

// 	}

// })

// // Start app

// app.listen(8082, 'localhost', () => {
// 	console.log('Server started. Listening on Port 8082')
// })