const { resolve } = require('path')
const { readdirSync } = require('fs')

function getFiles(dir, result) {
  const dirents = readdirSync(dir, { withFileTypes: true })
  let flag
  for (let dirent of dirents) {
    flag = true
    if (dirent.isDirectory() && dirent.name !== '.vuepress') {
      const dirname = `/${dirent.name}/`
      result[dirname] = []
      const subDirents = readdirSync(resolve(dir, dirent.name), { withFileTypes: true })
      for (let subDirent of subDirents) {
        if (subDirent.isDirectory()) continue
        const filename = subDirent.name.slice(0, -3)
        if (filename === 'README') {
          continue
        }
        const cate = filename.split('|')[1]
        const index = result[dirname].findIndex(d => d.title === cate)
        if (index > -1) {
          result[dirname][index].children.push(filename)
        } else {
          if (flag) {
            result[dirname].push({
              title: cate,
              collapsable: false,
              children: ['', filename]
            })
            flag = false
          } else {
            result[dirname].push({
              title: cate,
              collapsable: false,
              children: [filename]
            })
          }
        }
      }
    }
  }
}

;(() => {
  const result = {}

  getFiles(resolve(__dirname, '..'), result)
  console.log(JSON.stringify(result))
})()

exports.inferSiderbars = () => {
  const result = {}
  getFiles(resolve(__dirname, '..'), result)

  return result
}
