# force-del

[![Greenkeeper badge](https://badges.greenkeeper.io/luftywiranda13/force-del.svg)](https://greenkeeper.io/)

> Force delete files or folders using [globs](https://github.com/isaacs/minimatch#usage)

[![Package Version](https://img.shields.io/npm/v/force-del.svg?style=flat-square)](https://www.npmjs.com/package/force-del)
[![Downloads Status](https://img.shields.io/npm/dm/force-del.svg?style=flat-square)](https://npm-stat.com/charts.html?package=force-del&from=2016-04-01)
[![Build Status: Linux](https://img.shields.io/travis/luftywiranda13/force-del/master.svg?style=flat-square)](https://travis-ci.org/luftywiranda13/force-del)
[![Coverage Status](https://img.shields.io/codecov/c/github/luftywiranda13/force-del/master.svg?style=flat-square)](https://codecov.io/gh/luftywiranda13/force-del)

If the matching files or folders are managed by `git`, theyʼll be deleted and marked as `deleted` in staging area. Otherwise, theyʼll be deleted permanently (not to the trash).

## How does it work?

* Filters the files that should be deleted by using [globby](https://github.com/sindresorhus/globby)
* Maps the matching paths _one-by-one_ to be included in `git rm -rf` command
* Uses [rimraf](https://github.com/isaacs/rimraf) if the matching item isnʼt managed by `git`
* These processes run concurrently

## Installation

```sh
npm install force-del
```

## Usage

```js
const forceDel = require('force-del');

forceDel(['**/*.{gif,jpg}', 'oops/vids/*.3gp']).then(paths => {
  console.log('Deleted:\n', paths.join('\n'));
});
```

## API

### forceDel(patterns, [options])

Returns `Promise<Array>` of deleted paths.

#### patterns

Type: `string` | `string[]`

See supported minimatch [patterns](https://github.com/isaacs/minimatch#usage).

* [Pattern examples with expected matches](https://github.com/sindresorhus/multimatch/blob/master/test/test.js)
* [Quick globbing pattern overview](https://github.com/sindresorhus/multimatch#globbing-patterns)

#### options

Type: `Object`

##### concurrency

Type: `number`<br>
Default: `Infinity`<br>
Minimum: `1`

Concurrency limit.

##### cwd

Type: `string`<br />
Default: `process.cwd()`

Current working directory.

##### nodir

Type: `boolean`<br />
Default: `false`

From [node-glob](https://github.com/isaacs/node-glob#options). Set to `true` to match files only.

Other options are derived from the defaults of these libraries:

* [globby](https://github.com/sindresorhus/globby#options)
* [node-glob](https://github.com/isaacs/node-glob#options)
* [execa](https://github.com/sindresorhus/execa/#options)

## Related

* [force-del-cli](https://github.com/luftywiranda13/force-del-cli) － CLI for this module
* [remove-lockfiles](https://github.com/luftywiranda13/remove-lockfiles) － Prevent committing lockfiles

## License

MIT &copy; [Lufty Wiranda](https://www.luftywiranda.com)
