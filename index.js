'use strict';

const path = require('path');
const del = require('del');
const execa = require('execa');
const globby = require('globby');

const gitForceRemove = (files, cwd) =>
  execa('git', ['rm', '-f'].concat(files), { cwd }).then(() =>
    files.map(x => path.resolve(cwd, x))
  );

const forceDel = (patterns, { cwd = process.cwd() } = {}) =>
  globby(patterns, { cwd })
    .then(files => gitForceRemove(files, cwd))
    .catch(() => del(patterns, { cwd }));

module.exports = forceDel;
