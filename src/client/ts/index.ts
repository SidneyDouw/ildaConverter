import './fileHandle'


// function uploadFile(file: File) {

//     responseContainer.textContent = 'Uploading & Converting ...'

//     let formData = new FormData()
//         formData.append('ilda', file)

    
//     fetch('/convert', {
//         method: 'post',
//         body: formData
//     })
//     .then(response => {

//         if (response.status == 200) {
//             response.blob().then(blob => {

//                 let imageUrl = URL.createObjectURL(blob)

//                 let img = document.createElement('img')
//                     img.src = imageUrl
//                     img.onload = () => {
//                         URL.revokeObjectURL(imageUrl)
//                     }

//                 responseContainer.textContent = ''
//                 responseContainer.appendChild(img)

//             })
//         } else {
//             response.json().then(json => {

//                 responseContainer.textContent = json.message

//             })
//         }

//     })


// }