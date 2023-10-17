import { data } from 'autoprefixer'
import imgbb from '../constants/imgbb'

class UploadFilesService {
  upload(file, onUploadProgress) {
    let formData = new FormData()
    formData.append('image', file)

    let response = imgbb.post('1/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    })
    response
      .then((rest) => {
        let dataImagePath = JSON.parse(localStorage.getItem('storeData')) || []
        let tmpArray = [...dataImagePath, rest]
        localStorage.setItem('storeData', JSON.stringify(tmpArray))
      })
      .catch((error) => {
        console.log(error)
      })
    return response
  }

  getFiles() {
    return localStorage.getItem('storeData')
  }
}

export default new UploadFilesService()
