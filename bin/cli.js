#!/usr/bin/env node
'use strict'
const util = require('util')
const path = require('path')
const yargs = require('yargs')
const ora = require('ora')
const co = require('co')
const chalk = require('chalk')
const globby = require('globby')
const clipboardy = require('clipboardy')
const update = require('update')
const pkg = require('../package')
const main = require('../lib')
const config = require('../lib/config')

update({ pkg }).notify()

const argv = yargs
  .alias('v', 'version')
  .alias('h', 'help')
  .option('dot', {
    desc: 'Include dot files when using glob patterns'
  })
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
    desc: 'Add description for the gist',
    alias: 'desc'
  })
  .option('id', {
    desc: 'Existing gist id, used this to update existing gist',
    alias: 'i'
  })
  .option('public', {
    desc: 'Publish the gist publicly'
  })
  .string(['set-token', 'filename', 'id'])
  .boolean(['remove-token', 'get-token', 'public'])
  .example('gist-it npm-log.log')
  .example('gist-it a.js b.css c.html --desc "Example Website"')
  .example('gist-it "*.js"')
  .version(pkg.version)
  .help().argv

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

let files = argv._
if (files.length === 0) {
  console.error('The path to a text file is required!')
  console.error('eg: gist-it ./npm.log')
  process.exit(1)
}

let spinner

co(function*() {
  const maxWidth = process.stderr.columns - 5

  files = yield globby(files, { dot: argv.dot })

  if (files.length === 0) {
    throw new Error(
      `Expect at least one file to publish but got "${JSON.stringify(files)}"!`
    )
  }

  const fileList = files.map(filepath => path.basename(filepath)).join(', ')

  spinner = ora({
    text: `Uploading ${fileList}`.slice(0, maxWidth),
    spinner: 'dots10'
  }).start()

  const options = Object.assign(
    {
      files,
      token: config.get('token')
    },
    argv
  )

  if (options.id && !options.token) {
    throw new Error('You can edit anonymous gist, please set a private token!')
  }

  const data = yield main(options)
  let msg = data.html_url
  try {
    clipboardy.writeSync(data.html_url)
    msg += ' (copied)'
  } catch (err) {
    // Ignore errors
  }
  spinner.succeed(`${chalk.green(argv.id ? 'Updated:' : 'Published:')} ${msg}`)

  if (!argv.id && options.token) {
    console.log(chalk.dim(`You can update this gist by running:\ngist-it ${process.argv.slice(2).join(' ')} --id ${data.id}`))
  }
}).catch(err => {
  spinner && spinner.stop()
  if (err.response) {
    console.error(
      util.inspect(err.response.data, {
        colors: true,
        depth: null
      })
    )
  } else {
    console.error(err.stack)
  }
  process.exit(1)
})
