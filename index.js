const path = require('path')
const fs = require('fs-extra')
const co = require('co')
const request = require('axios')

module.exports = co.wrap(function * (filepath, options) {
  const content = yield fs.readFile(filepath, 'utf8')
  const res = yield request.post('https://api.github.com/gists', {
    public: options.public,
    files: {
      [path.basename(filepath)]: {
        content
      }
    }
  })
  return res.data
})
