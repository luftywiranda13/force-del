'use strict';

const { join } = require('path');
const { pathExists } = require('fs-extra');
const execa = require('execa');
const fixtures = require('fixturez');
const gStatus = require('g-status');

const forceDel = require('../');

const f = fixtures(__dirname);

it('deletes untracked directory', async () => {
  expect.assertions(2);

  const tmpPath = f.copy('fixtures');
  await execa('git', ['init'], { cwd: tmpPath });
  await execa('git', ['add', 'foo'], { cwd: tmpPath });

  await forceDel('foo', { cwd: tmpPath });

  await expect(gStatus({ cwd: tmpPath, path: 'foo' })).resolves.toEqual([]);
  await expect(pathExists(join(tmpPath, 'foo'))).resolves.toBe(false);
});

it('deletes directory in general file system', async () => {
  expect.assertions(1);

  const tmpPath = f.copy('fixtures');

  await forceDel('foo', { cwd: tmpPath });

  await expect(pathExists(join(tmpPath, 'foo'))).resolves.toBe(false);
});

it('deletes files in general file system', async () => {
  expect.assertions(1);

  const tmpPath = f.copy('fixtures');

  await forceDel('**/*', { cwd: tmpPath });

  await expect(pathExists(join(tmpPath, 'foo'))).resolves.toBe(false);
});

it('deletes staged files', async () => {
  expect.assertions(1);

  const tmpPath = f.copy('fixtures');
  await execa('git', ['init'], { cwd: tmpPath });
  await execa('git', ['add', '--all'], { cwd: tmpPath });

  await forceDel('**/*', { cwd: tmpPath });

  // No commits made,
  // Staging area should not list any files as `deleted`
  await expect(gStatus({ cwd: tmpPath, index: 'D' })).resolves.toEqual([]);
});

it('deletes committed files', async () => {
  expect.assertions(1);

  const tmpPath = f.copy('fixtures');
  await execa('git', ['init'], { cwd: tmpPath });
  await execa('git', ['add', '--all'], { cwd: tmpPath });
  await execa('git', ['commit', '-m', 'initial commit'], { cwd: tmpPath });

  await forceDel('**/*', { cwd: tmpPath });

  // Staging area should list files marked as `deleted`
  await expect(gStatus({ cwd: tmpPath, index: 'D' })).resolves.not.toEqual([]);
});
