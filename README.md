# gist-it

[![NPM version](https://img.shields.io/npm/v/gist-it.svg?style=flat)](https://npmjs.com/package/gist-it) [![NPM downloads](https://img.shields.io/npm/dm/gist-it.svg?style=flat)](https://npmjs.com/package/gist-it) [![CircleCI](https://circleci.com/gh/egoist/gist-it/tree/master.svg?style=shield)](https://circleci.com/gh/egoist/gist-it/tree/master)  [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

![gist](https://cloud.githubusercontent.com/assets/8784712/26835939/08b685ee-4b0c-11e7-865b-77bb7e0b95ab.gif)

## Why do we need this?

**A.** When I ran into some issues and got a `error.log`, the best way to report bugs is `gist-it error.log` and post the link to it on the issue you created.

**B.** Somebody asked me to provide a repo to reproduce a bug, so I made it locally and upload it to gist in order to share with him without creating a repo for that.

## Install

```bash
yarn global add gist-it
# OR
npm i -g gist-it
```

## Usage

```bash
gist-it ./npm.log
gist-it lib/foo.js bin/bar.js

# or even glob
gist-it "*.js" "css/*.css"

gist-it --help
```

By default the gist will be published **anonymously**, to publish it under your account, you need to generate an access token at https://github.com/settings/tokens/new, remember to select `gist` scope:

![gist-scope](https://ooo.0o0.ooo/2017/05/27/592951a01af2b.png)

Then set it in `gist-it`:

```bash
gist-it --set-token $the_token_you_just_generated
```

To use a token without storing it:

```bash
gist-it --token $your_token
```

To not to use stored token for once:

```bash
gist-it --no-token
```

### Update an exising gist

To update an exisitng gist, append the command with `--id existing-gist-id`.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**gist-it** © [egoist](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by egoist with help from contributors ([list](https://github.com/egoist/gist-it/contributors)).

> [egoistian.com](https://egoistian.com) · GitHub [@egoist](https://github.com/egoist) · Twitter [@rem_rin_rin](https://twitter.com/rem_rin_rin)
