'use strict';

const { pathExists } = require('fs-extra');
const execa = require('execa');
const fixtures = require('fixturez');
const pify = require('pify');
const sgf = require('staged-git-files');

const forceDel = require('./');

const f = fixtures(__dirname);

describe('git repo', () => {
  const realCWD = process.cwd();
  let tmpPath;

  beforeEach(async () => {
    tmpPath = f.copy('fixtures');
    sgf.cwd = tmpPath;

    process.chdir(tmpPath);
    await execa('git', ['init']);
  });

  afterEach(() => {
    sgf.cwd = realCWD;
    process.chdir(realCWD);
  });

  it('deletes new directory', async () => {
    expect.assertions(2);

    await execa('git', ['add', 'foo']);
    await forceDel('foo');

    // No files are tracked.
    // So, Staging area should not list anything
    await expect(pify(sgf)()).resolves.toEqual([]);
    await expect(pathExists('foo')).resolves.toBe(false);
  });

  it('deletes new files', async () => {
    expect.assertions(1);

    await execa('git', ['add', '--all']);
    await forceDel('**/*');

    await expect(pify(sgf)()).resolves.toEqual([]);
  });

  it('deletes committed files', async () => {
    expect.assertions(1);

    await execa('git', ['add', '--all']);
    await execa('git', ['commit', '-m', 'initial commit']);
    await forceDel('**/*');

    // Staging area should list files marked as `deleted`
    await expect(pify(sgf)()).resolves.not.toEqual([]);
  });
});

describe('general file-system', () => {
  const realCWD = process.cwd();
  let tmpPath;

  beforeEach(async () => {
    tmpPath = f.copy('fixtures');

    process.chdir(tmpPath);
  });

  afterEach(() => {
    process.chdir(realCWD);
  });

  it('deletes directory', async () => {
    expect.assertions(1);

    await forceDel('foo');

    await expect(pathExists('foo')).resolves.toBe(false);
  });

  it('deletes files', async () => {
    expect.assertions(1);

    await forceDel('**/*');

    await expect(pathExists('foo')).resolves.toBe(false);
  });
});
