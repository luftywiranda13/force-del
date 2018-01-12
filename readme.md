# force-del

> Force delete files or folders using glob patterns

[![Package Version](https://img.shields.io/npm/v/force-del.svg?style=flat-square)](https://www.npmjs.com/package/force-del)
[![Downloads Status](https://img.shields.io/npm/dm/force-del.svg?style=flat-square)](https://npm-stat.com/charts.html?package=force-del&from=2016-04-01)
[![Build Status: Linux](https://img.shields.io/travis/luftywiranda13/force-del/master.svg?style=flat-square)](https://travis-ci.org/luftywiranda13/force-del)
[![Build Status: Windows](https://img.shields.io/appveyor/ci/luftywiranda13/force-del/master.svg?style=flat-square&logo=appveyor)](https://ci.appveyor.com/project/luftywiranda13/force-del/branch/master)
[![Coverage Status](https://img.shields.io/codecov/c/github/luftywiranda13/force-del/master.svg?style=flat-square)](https://codecov.io/gh/luftywiranda13/force-del)

If the matching files or folders are managed by `git` theyʼll be deleted and marked as `deleted` in staging area, ready to be committed. In the other hand, `force-del` will delete them permanently (not to the trash).

## How does it work?

* Filters the files that should be deleted by using [globby](https://github.com/sindresorhus/globby)
* Maps those files to be included in `git rm -f` command _one-by-one_
* Fallbacks to use [del](https://github.com/sindresorhus/del) if those files arenʼt managed by `git`
* These processes run concurrently

## Installation

```sh
npm install --save force-del
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

Returns `Promise<string[]>` of deleted paths.

#### patterns

Type: `string` | `string[]`

See supported minimatch [patterns](https://github.com/isaacs/minimatch#usage).

* [Pattern examples with expected matches](https://github.com/sindresorhus/multimatch/blob/master/test/test.js)
* [Quick globbing pattern overview](https://github.com/sindresorhus/multimatch#globbing-patterns)

#### options

Type: `Object`

##### cwd

Type: `string`<br />
Default: `process.cwd()`

Current working directory.

## Related

* [force-del-cli](https://github.com/luftywiranda13/force-del-cli) － CLI for this module
* [remove-lockfiles](https://github.com/luftywiranda13/remove-lockfiles) － Prevent committing lockfiles

## License

MIT &copy; [Lufty Wiranda](https://www.luftywiranda.com)
