import { getPagesFromURL } from './index'
export function readPdfFile (inputFile) {
  const temporaryFileReader = new FileReader()

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort()
      reject(new DOMException('Problem parsing input file.'))
    }

    temporaryFileReader.onload = () => {
      resolve(getPagesFromURL(temporaryFileReader.result))
    }
    temporaryFileReader.readAsDataURL(inputFile)
  })
}
