import globals from './globals'

const downloadButton = document.getElementById('download')!
downloadButton.onclick = () => {
    // Assemble request body data

    const formData = new FormData()
    formData.append('data', globals.activeFile!)

    formData.append('resolution', globals.settings.resolution + '')
    formData.append('lineWidth', globals.settings.lineWidth + '')
    formData.append('fps', globals.settings.fps + '')

    formData.append('fileFormat', globals.settings.fileFormat + '')

    fetch('/convert', {
        method: 'post',
        body: formData,
    }).then((response) => {
        if (response.status == 200) {
            response.blob().then((blob) => {
                const url = URL.createObjectURL(blob)

                const a = document.createElement('a')
                a.style.display = 'none'
                a.href = url

                if (globals.settings.fileFormat == 'GIF') {
                    a.download = globals.activeFile!.name.replace('.ild', '.gif')
                } else {
                    a.download = globals.activeFile!.name.replace('.ild', '.zip')
                }

                document.body.appendChild(a)
                a.click()

                URL.revokeObjectURL(url)
            })
        } else {
            response.json().then((json) => {
                console.log(json)
            })
        }
    })
}
