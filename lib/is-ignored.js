'use strict';

module.exports = file => {
  const DEFAULTS = [
    '/.git', // `git` doesn't track `.git` dir
    '/.grunt',
    '/.nyc_output',
    '/bower_components',
    '/build',
    '/coverage',
    '/dist',
    '/node_modules'
  ];

  return DEFAULTS.some(x => file.includes(x));
};
