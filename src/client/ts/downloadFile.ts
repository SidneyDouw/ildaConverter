import globals from './globals'


let downloadButton = document.getElementById('download')
    downloadButton.onclick = () => {

    // Assemble request body data

    let formData = new FormData()
        formData.append('data', globals.activeFile)

        formData.append('resolution', globals.settings.resolution + '')
        formData.append('lineWidth', globals.settings.lineWidth + '')
        formData.append('fps', globals.settings.fps + '')
        
        // formData.append('fileFormat', globals.settings.fileFormat + '')

    
    fetch('/convertToGif', {
        method: 'post',
        body: formData
    })
    .then(response => {

        console.log(response.headers)

        if (response.status == 200) {
            response.blob().then(blob => {

                let url = URL.createObjectURL(blob)
                
                let a = document.createElement('a')
                    a.style.display = 'none';
                    a.href = url;
                    a.download = globals.activeFile.name.replace('.ild', '.gif')

                document.body.appendChild(a)
                a.click()
                
                URL.revokeObjectURL(url)

            })
        } else {
            response.json().then(json => {

                console.log(json)

            })
        }

    })


}