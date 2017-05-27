#!/usr/bin/env node
'use strict'
const util = require('util')
const path = require('path')
const yargs = require('yargs')
const ora = require('ora')
const pkg = require('../package')
const main = require('../lib')
const config = require('../lib/config')

const argv = yargs
  .alias('v', 'version')
  .alias('h', 'help')
  .alias('desc', 'description')
  .option('set-token', {
    desc: 'Set personal access token for GitHub'
  })
  .option('remove-token', {
    desc: 'Remove stored access token'
  })
  .option('get-token', {
    desc: 'Output current access token'
  })
  .option('description', {
    desc: 'Add description for the gist'
  })
  .string('set-token')
  .boolean(['remove-token', 'get-token'])
  .example('gist-it npm-log.log')
  .example('gist-it a.js b.css c.html --desc "Example Website"')
  .version(pkg.version)
  .help()
  .argv

if (argv.setToken) {
  config.set('token', argv.setToken)
  console.log('Token has been updated!')
  process.exit()
}

if (argv.removeToken) {
  config.delete('token')
  console.log('Token has been removed!')
  process.exit()
}

if (argv.getToken) {
  console.log(config.get('token') || 'N/A')
  process.exit()
}

const files = argv._
if (files.length === 0) {
  console.error('The path to a text file is required!')
  console.error('eg: gist-it ./npm.log')
  process.exit(1)
}

const maxWidth = process.stderr.columns - 5

const fileList = files
  .map(filepath => path.basename(filepath))
  .join(', ')

const spinner = ora({
  text: `Uploading ${fileList}`.slice(0, maxWidth),
  spinner: 'dots10'
}).start()

const options = Object.assign({
  files,
  token: config.get('token')
}, argv)

main(options)
.then(data => {
  spinner.succeed(data.html_url)
})
.catch(err => {
  spinner.stop()
  if (err.response) {
    console.error(util.inspect(err.response.data, {
      colors: true,
      depth: null
    }))
  } else {
    console.error(err.stack)
  }
  process.exit(1)
})
