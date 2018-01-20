'use strict';

const pify = require('pify');
const rimraf = require('rimraf');

const rimrafP = pify(rimraf);

module.exports = file => rimrafP(file, { glob: false }).then(() => file);
