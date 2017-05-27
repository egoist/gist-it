#!/usr/bin/env node
'use strict'
const util = require('util')
const yargs = require('yargs')
const ora = require('ora')
const pkg = require('../package')
const main = require('../lib')
const config = require('../lib/config')

const argv = yargs
  .alias('v', 'version')
  .alias('h', 'help')
  .option('set-token', {
    desc: 'Set personal access token for GitHub'
  })
  .option('remove-token', {
    desc: 'Remove stored access token'
  })
  .option('get-token', {
    desc: 'Output current access token'
  })
  .string('set-token')
  .boolean(['remove-token', 'get-token'])
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

const filepath = argv._[0]
if (!filepath) {
  console.error('The path to a text file is required!')
  console.error('eg: gist-it ./npm.log')
  process.exit(1)
}

const spinner = ora({
  text: `Uploading ${filepath}...`,
  spinner: 'dots10'
}).start()

const options = Object.assign({
  token: config.get('token')
}, argv)

main(filepath, options)
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
