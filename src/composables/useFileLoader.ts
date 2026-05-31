import { ISavedParams } from '../types'

export function useFileLoader() {
  function downloadJSON(obj: ISavedParams, name: string) {
    const dataUri = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(obj))
    const anchorElement = document.createElement('a')
    anchorElement.href = dataUri
    anchorElement.download = `${name}.json`
    document.body.appendChild(anchorElement)
    anchorElement.click()
    document.body.removeChild(anchorElement)
  }

  function downloadURI(uri: string, name: string) {
    const link = document.createElement('a')
    link.download = name
    link.href = uri
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function readFile(fileupload: HTMLInputElement): Promise<ISavedParams> {
    return new Promise((resolve, reject) => {
      const files = fileupload.files || null
      if (!files) {
        reject(new Error('No files selected'))
        return
      }
      const file = files[0]
      if (!file) {
        reject(new Error('No file selected'))
        return
      }
      const reader = new FileReader()

      reader.readAsText(file)

      reader.onload = () => resolve(JSON.parse(reader.result as string))
      reader.onerror = () => reject(reader.error)
    })
  }

  return {
    downloadJSON,
    downloadURI,
    readFile,
  }
}
