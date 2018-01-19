'use strict';

const execa = require('execa');

const gitForceRemove = (file, options) => {
  return execa('git', ['rm', '-rf', file], options).then(() => file);
};

module.exports = gitForceRemove;
