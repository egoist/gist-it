const path = require('path')
const fs = require('fs-extra')
const co = require('co')
const request = require('axios')

module.exports = co.wrap(function * (filepath, options = {}) {
  const content = yield fs.readFile(filepath, 'utf8')

  const data = {
    public: options.public,
    files: {
      [path.basename(filepath)]: {
        content
      }
    },
    description: options.description || 'Created by gist-it (https://github.com/egoist/gist-it)'
  }

  const headers = {}
  if (options.token) {
    headers.Authorization = `token ${options.token}`
  }

  const res = yield request('https://api.github.com/gists', {
    method: 'post',
    data,
    headers
  })

  return res.data
})
