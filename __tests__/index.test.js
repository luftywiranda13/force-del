'use strict';

const { join } = require('path');
const { pathExists } = require('fs-extra');
const execa = require('execa');
const fixtures = require('fixturez');
const gStatus = require('g-status');

const forceDel = require('../');

const f = fixtures(__dirname);

describe('git repo', () => {
  let tmpPath;

  beforeEach(async () => {
    tmpPath = f.copy('fixtures');
    await execa('git', ['init'], { cwd: tmpPath });
  });

  it('deletes new directory', async () => {
    expect.assertions(2);

    await execa('git', ['add', 'foo'], { cwd: tmpPath });
    await forceDel('foo', { cwd: tmpPath });

    await expect(gStatus({ cwd: tmpPath, patterns: 'foo' })).resolves.toEqual(
      []
    );
    await expect(pathExists(join(tmpPath, 'foo'))).resolves.toBe(false);
  });

  it('deletes new files', async () => {
    expect.assertions(1);

    await execa('git', ['add', '--all'], { cwd: tmpPath });
    await forceDel('**/*', { cwd: tmpPath });

    // No commits made,
    // Staging area should not list any files as `deleted`
    await expect(
      gStatus({ cwd: tmpPath, status: { index: 'D' } })
    ).resolves.toEqual([]);
  });

  it('deletes committed files', async () => {
    expect.assertions(1);

    await execa('git', ['add', '--all'], { cwd: tmpPath });
    await execa('git', ['commit', '-m', 'initial commit'], { cwd: tmpPath });
    await forceDel('**/*', { cwd: tmpPath });

    // Staging area should list files marked as `deleted`
    await expect(
      gStatus({ cwd: tmpPath, status: { index: 'D' } })
    ).resolves.not.toEqual([]);
  });
});

describe('general file-system', () => {
  let tmpPath;

  beforeEach(async () => {
    tmpPath = f.copy('fixtures');
  });

  it('deletes directory', async () => {
    expect.assertions(1);

    await forceDel('foo', { cwd: tmpPath });

    await expect(pathExists(join(tmpPath, 'foo'))).resolves.toBe(false);
  });

  it('deletes files', async () => {
    expect.assertions(1);

    await forceDel('**/*', { cwd: tmpPath });

    await expect(pathExists(join(tmpPath, 'foo'))).resolves.toBe(false);
  });
});
