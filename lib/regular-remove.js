'use strict';

const pify = require('pify');
const rimraf = require('rimraf');

const rimrafP = pify(rimraf);

const regularRemove = file => rimrafP(file, { glob: false }).then(() => file);

module.exports = regularRemove;
