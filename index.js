'use strict';

const { resolve } = require('path');
const execa = require('execa');
const globby = require('globby');
const pify = require('pify');
const pMap = require('p-map');
const rimraf = require('rimraf');

const rimrafP = pify(rimraf);

const gitForceRemove = (file, options) =>
  execa('git', ['rm', '-rf', file], options).catch(err => {
    if (
      err.stderr.startsWith('fatal: Not a git repository') ||
      err.stderr.startsWith('fatal: pathspec')
    ) {
      return Promise.resolve(rimrafP(file, { glob: false }));
    }

    return Promise.reject(err);
  });

const forceDel = (patterns, options) => {
  const DEFAULTS = { nodir: false };
  const opts = Object.assign({}, DEFAULTS, options);

  const mapper = file => {
    const resolvedFile = resolve(opts.cwd || '', file);

    return gitForceRemove(resolvedFile, opts).then(() => resolvedFile);
  };

  return globby(patterns, opts).then(files => pMap(files, mapper, opts));
};

module.exports = forceDel;
