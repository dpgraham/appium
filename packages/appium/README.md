appium-cli
==========



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/appium-cli.svg)](https://npmjs.org/package/appium-cli)
[![Downloads/week](https://img.shields.io/npm/dw/appium-cli.svg)](https://npmjs.org/package/appium-cli)
[![License](https://img.shields.io/npm/l/appium-cli.svg)](https://github.com/appium/appium/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g appium
$ appium COMMAND
running command...
$ appium (-v|--version|version)
appium/2.0.0 darwin-x64 node-v10.11.0
$ appium --help [COMMAND]
USAGE
  $ appium COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`appium clean`](#appium-clean)
* [`appium help [COMMAND]`](#appium-help-command)
* [`appium install PACKAGE`](#appium-install-package)

## `appium clean`

Removes all Appium drivers

```
USAGE
  $ appium clean

OPTIONS
  --verbose  Show full logs
```

_See code: [build/lib/cli/commands/clean.js](https://github.com/appium/appium/blob/v2.0.0/build/lib/cli/commands/clean.js)_

## `appium help [COMMAND]`

display help for appium

```
USAGE
  $ appium help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.3/src/commands/help.ts)_

## `appium install PACKAGE`

Installs an Appium driver

```
USAGE
  $ appium install PACKAGE

OPTIONS
  --file     Install an Appium driver from a local directory
  --git      Install an Appium driver from a git repository
  --npm      Install an Appium driver from an NPM repository
  --verbose  Show full logs

DESCRIPTION
  ...
  Install an Appium Driver from a list of supported drivers.

  Or install an Appium Driver from npm, git or local folder
```

_See code: [build/lib/cli/commands/install.js](https://github.com/appium/appium/blob/v2.0.0/build/lib/cli/commands/install.js)_
<!-- commandsstop -->

## Dev

* To run CLI commands locally, replace `appium` with `./bin/run` (e.g.: instead of `appium install xcuitest`, use `./bin/run install xcuitest`)
