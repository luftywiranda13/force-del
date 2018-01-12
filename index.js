'use strict';

const { resolve } = require('path');
const del = require('del');
const execa = require('execa');
const globby = require('globby');
const pMap = require('p-map');

const forceDel = (file, cwd) =>
  execa('git', ['rm', '-f', file], { cwd })
    .then(() => [resolve(file)])
    .catch(() => del(file, { cwd }));

module.exports = (patterns, { cwd = process.cwd() } = {}) => {
  const mapper = file => forceDel(file, cwd);

  return globby(patterns, { cwd })
    .then(files => pMap(files, mapper))
    .then(res => [].concat(...res));
};
