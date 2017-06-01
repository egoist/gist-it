const path = require('path')
const fs = require('fs-extra')
const co = require('co')
const request = require('axios')

const defaultDescription =
  'Created by gist-it (https://github.com/egoist/gist-it)'

module.exports = co.wrap(function*(
  {
    files = [],
    description = defaultDescription,
    public: isPublic,
    token,
    id
  } = {}
) {
  files = yield Promise.all(
    files.map(filepath => {
      return fs.readFile(filepath, 'utf8').then(content => ({
        content,
        filepath: path.basename(filepath)
      }))
    })
  )

  files = files.reduce((current, next) => {
    current[next.filepath] = {
      content: next.content
    }
    return current
  }, {})

  const data = {
    public: isPublic,
    files,
    description
  }

  const headers = {}
  if (token) {
    headers.Authorization = `token ${token}`
  }

  const url = id
    ? `https://api.github.com/gists/${id}`
    : 'https://api.github.com/gists'

  const res = yield request(url, {
    method: id ? 'patch' : 'post',
    data,
    headers
  })

  return res.data
})
