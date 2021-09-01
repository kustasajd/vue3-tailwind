export function getPagesFromURL (url) {
  return new Promise((resolve, reject) => {
    import('pdfjs-dist').then(pdfjsLib => {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.7.570/build/pdf.worker.min.js'
      pdfjsLib
        .getDocument(url)
        .promise.then(doc => {
          Promise.all(
            [...Array(doc.numPages).keys()].map((_, i) => doc.getPage(i + 1))
          )
            .then(pages => {
              resolve(
                pages.map((x: any, i) => {
                  ;(x.pageNo = i), (x.title = `title_${Date.now()}`)
                  x.selected = false
                  x.description = ''
                  return x
                })
              )
            })
            .catch(e => {
              reject(e)
            })
        })
        .catch(e => {
          reject(e)
        })
    })
  })
}
