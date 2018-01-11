# force-del

[![Package Version](https://img.shields.io/npm/v/force-del.svg)](https://www.npmjs.com/package/force-del)
[![Build Status: Linux](https://img.shields.io/travis/luftywiranda13/force-del/master.svg)](https://travis-ci.org/luftywiranda13/force-del)
[![Build Status: Windows](https://ci.appveyor.com/api/projects/status/1txdukxkuep0peid/branch/master?svg=true)](https://ci.appveyor.com/project/luftywiranda13/force-del/branch/master)
[![Coverage Status](https://img.shields.io/codecov/c/github/luftywiranda13/force-del/master.svg)](https://codecov.io/gh/luftywiranda13/force-del)
[![Downloads Status](https://img.shields.io/npm/dm/force-del.svg)](https://npm-stat.com/charts.html?package=force-del&from=2016-04-01)

Force delete files or folders using glob patterns.

Remember that if `git` doesnʼt manage those files, `force-del` will delete them permanently (not to the trash).

## How does it works?

* Files were committed in `git`:

  Run `git rm -f file1 file2 …` under the hood. As the result, those files are deleted and marked as `deleted` in your staging area.

* Files are in staging area:

  Like before, run `git rm -f file1 file2 …` under the hood. Those files will also be marked as `deleted` in your staging area.

* Files are not managed by `git`:

  `force-del` will perform deletion by utilizing [del](https://github.com/sindresorhus/del).

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

* [force-del-cli](https://github.com/luftywiranda13/remove-lockfiles) － CLI for this module
* [remove-lockfiles](https://github.com/luftywiranda13/remove-lockfiles) － Prevent committing lockfiles

## License

MIT &copy; [Lufty Wiranda](https://www.luftywiranda.com)
