'use strict';

const { resolve } = require('path');

const globby = require('globby');
const pMap = require('p-map');

const deleteFile = require('./lib/delete-file');

const optionsManager = options => {
  const DEFAULTS = {
    nodir: false,
    cwd: process.cwd(),
  };

  return Object.assign({}, DEFAULTS, options);
};

module.exports = (patterns, options) => {
  const opts = optionsManager(options);
  const mapper = file => deleteFile(file, opts);

  return globby(patterns, opts)
    .then(files => files.map(x => resolve(opts.cwd, x)))
    .then(files => pMap(files, mapper, opts));
};
