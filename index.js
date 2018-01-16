'use strict';

const { resolve } = require('path');
const del = require('del');
const execa = require('execa');
const globby = require('globby');
const pMap = require('p-map');

const forceDelete = (file, options) =>
  execa('git', ['rm', '-rf', file], options)
    .then(() => resolve(options.cwd, file))
    .catch(() => del(file, options));

module.exports = (patterns, { cwd = process.cwd() } = {}) => {
  const opts = Object.assign({}, { cwd, nodir: false });

  const mapper = file => forceDelete(file, opts);

  return globby(patterns, opts)
    .then(files => pMap(files, mapper))
    .then(res => [].concat(...res));
};
