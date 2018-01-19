'use strict';

const isIgnored = file => {
  const DEFAULT_LISTS = [
    '/bower_components',
    '/coverage',
    '/dist',
    '/node_modules',
  ];

  return DEFAULT_LISTS.some(x => file.includes(x));
};

module.exports = isIgnored;
