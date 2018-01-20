'use strict';

const execa = require('execa');

module.exports = (file, options) => {
  return execa('git', ['rm', '-rf', file], options).then(() => file);
};
