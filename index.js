'use strict';

const { resolve } = require('path');
const execa = require('execa');
const globby = require('globby');
const pify = require('pify');
const pMap = require('p-map');
const rimraf = require('rimraf');

const rimrafP = pify(rimraf);

const DEFAULTS = { nodir: false, force: true };

const gitForceRemove = (file, options) => {
  const resolvedFile = resolve(options.cwd || '', file);

  return execa('git', ['rm', '-rf', resolvedFile], options)
    .then(() => resolvedFile)
    .catch(() => rimrafP(resolvedFile, { glob: false }))
    .then(() => resolvedFile);
};

const forceDel = (patterns, options) => {
  const opts = Object.assign({}, DEFAULTS, options);

  const mapper = file => gitForceRemove(file, opts);

  return globby(patterns, opts)
    .then(files => pMap(files, mapper, opts))
    .then(res => [].concat(...res));
};

module.exports = forceDel;
