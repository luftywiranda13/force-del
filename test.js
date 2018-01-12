'use strict';

const { join } = require('path');
const { pathExistsSync } = require('fs-extra');
const execa = require('execa');
const fixtures = require('fixturez');

const forceDel = require('./');

const f = fixtures(__dirname);

const setupRepo = async cwd => {
  await execa('git', ['init'], { cwd });
  await execa('git', ['add', '--all'], { cwd });
};

describe('in temp dir', () => {
  it('removes files from git repo', async () => {
    expect.assertions(3);
    const tmpPath = f.copy('fixtures');

    await setupRepo(tmpPath);
    await forceDel('**/*.txt', { cwd: tmpPath });

    expect(pathExistsSync(join(tmpPath, 'bar.txt'))).toBe(false);
    expect(pathExistsSync(join(tmpPath, 'file.txt'))).toBe(false);
    expect(pathExistsSync(join(tmpPath, 'nested', 'nested-file.txt'))).toBe(
      false
    );
  });

  it('removes files from general file-system', async () => {
    expect.assertions(3);
    const tmpPath = f.copy('fixtures');

    await forceDel('**/*.txt', { cwd: tmpPath });

    expect(pathExistsSync(join(tmpPath, 'bar.txt'))).toBe(false);
    expect(pathExistsSync(join(tmpPath, 'file.txt'))).toBe(false);
    expect(pathExistsSync(join(tmpPath, 'nested', 'nested-file.txt'))).toBe(
      false
    );
  });
});

describe('in `process.cwd()`', () => {
  const realCWD = process.cwd();

  afterEach(() => {
    // Move the process back to the real `process.cwd()`
    process.chdir(realCWD);
  });

  it('removes files from git repo', async () => {
    expect.assertions(3);
    const tmpPath = f.copy('fixtures');
    process.chdir(tmpPath);

    await setupRepo(tmpPath);
    await forceDel('**/*.txt');

    expect(pathExistsSync(join(tmpPath, 'bar.txt'))).toBe(false);
    expect(pathExistsSync(join(tmpPath, 'file.txt'))).toBe(false);
    expect(pathExistsSync(join(tmpPath, 'nested', 'nested-file.txt'))).toBe(
      false
    );
  });

  it('removes files from general file-system', async () => {
    expect.assertions(3);
    const tmpPath = f.copy('fixtures');
    process.chdir(tmpPath);

    await forceDel('**/*.txt');

    expect(pathExistsSync(join(tmpPath, 'bar.txt'))).toBe(false);
    expect(pathExistsSync(join(tmpPath, 'file.txt'))).toBe(false);
    expect(pathExistsSync(join(tmpPath, 'nested', 'nested-file.txt'))).toBe(
      false
    );
  });
});
