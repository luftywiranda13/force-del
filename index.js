'use strict';

const { resolve } = require('path');
const execa = require('execa');
const globby = require('globby');
const pify = require('pify');
const pMap = require('p-map');
const rimraf = require('rimraf');

const rimrafP = pify(rimraf);

const DEFAULTS = { nodir: false, force: true };

const gitForceRemove = (file, options) =>
  execa('git', ['rm', '-rf', file], options)
    // TODO: handle specific `git` errors
    .catch(() => rimrafP(file, { glob: false }));

const forceDel = (patterns, options) => {
  const opts = Object.assign({}, DEFAULTS, options);

  const mapper = file => {
    const resolvedFile = resolve(opts.cwd || '', file);

    return gitForceRemove(resolvedFile, opts).then(() => resolvedFile);
  };

  return globby(patterns, opts)
    .then(files => pMap(files, mapper, opts))
    .then(res => [].concat(...res));
};

module.exports = forceDel;
