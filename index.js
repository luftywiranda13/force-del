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

  const deleteFiles = file => gitForceRemove(file, opts).then(() => file);

  return globby(patterns, opts)
    .then(files => files.map(x => resolve(opts.cwd || '', x)))
    .then(resolvedFiles => pMap(resolvedFiles, deleteFiles, opts));
};

module.exports = forceDel;
