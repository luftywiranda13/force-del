'use strict';

const { resolve } = require('path');

const globby = require('globby');
const pMap = require('p-map');

const deleteFile = require('./lib/delete-file');

module.exports = (patterns, options = {}) => {
  const opts = Object.assign({ onlyFiles: false, cwd: process.cwd() }, options);

  const mapper = file => deleteFile(file, opts);

  return globby(patterns, opts)
    .then(files => files.map(x => resolve(opts.cwd, x)))
    .then(files => pMap(files, mapper, opts));
};
