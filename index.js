'use strict';

const { resolve } = require('path');
const del = require('del');
const execa = require('execa');
const globby = require('globby');
const pMap = require('p-map');

const gitForceRemove = (file, options) =>
  execa('git', ['rm', '-rf', file], options)
    .then(() => resolve(options.cwd || '', file))
    .catch(() => del(file, options));

module.exports = (patterns, options) => {
  const DEFAULTS = { nodir: false, force: true };
  const opts = Object.assign({}, DEFAULTS, options);

  const mapper = file => gitForceRemove(file, opts);

  return globby(patterns, opts)
    .then(files => pMap(files, mapper))
    .then(res => [].concat(...res));
};
