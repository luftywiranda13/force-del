'use strict';

const gitForceRemove = require('./git-force-remove');
const isIgnored = require('./is-ignored');
const regularRemove = require('./regular-remove');

const deleteFile = (file, options) => {
  if (isIgnored(file)) {
    return regularRemove(file);
  }

  return gitForceRemove(file, options).catch(err => {
    const stderr = err.stderr;

    if (err.message === 'spawn git EAGAIN') {
      return Promise.reject(
        new Error('Exceeded process limit, try again later.')
      );
    }

    if (
      stderr.startsWith('fatal: Not a git repository') ||
      stderr.startsWith('fatal: pathspec')
    ) {
      return Promise.resolve(regularRemove(file));
    }

    return Promise.reject(stderr);
  });
};

module.exports = deleteFile;
