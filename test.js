'use strict';

const path = require('path');
const { existsSync, mkdir, writeFileSync } = require('fs-extra');
const execa = require('execa');
const pify = require('pify');
const sgf = require('staged-git-files');
const tempy = require('tempy');

const forceDel = require('./');

describe('in temp dir', () => {
  let fixtures;
  const files = ['1.tmp', '2.tmp', '3.tmp', 'n.tmp'];

  beforeEach(async () => {
    fixtures = path.join(tempy.directory(), 'fixtures');
    await mkdir(fixtures);

    files.forEach(x => {
      writeFileSync(`${fixtures}/${x}`);
    });
  });
  it('forces delete files', async () => {
    expect.assertions(5);

    // Setup dummy git repo
    await execa('git', ['init'], { cwd: fixtures });
    await execa('git', ['add'].concat(files), { cwd: fixtures });

    await forceDel('*.tmp', { cwd: fixtures });

    sgf.cwd = fixtures;
    const stagedFiles = await pify(sgf)();

    expect(stagedFiles).toEqual([]);
    expect(existsSync(`${fixtures}/1.tmp`)).toBe(false);
    expect(existsSync(`${fixtures}/2.tmp`)).toBe(false);
    expect(existsSync(`${fixtures}/3.tmp`)).toBe(false);
    expect(existsSync(`${fixtures}/n.tmp`)).toBe(false);
  });

  it('resolves absolute paths of deleted files', async () => {
    expect.assertions(1);
    const expected = files.map(x => path.join(fixtures, x));

    const res = await forceDel('*.tmp', { cwd: fixtures });

    expect(res).toEqual(expected);
  });

  it('resolves empty array when no files matched', async () => {
    expect.assertions(1);

    const res = await forceDel('*.jpg', { cwd: fixtures });

    expect(res).toEqual([]);
  });
});

describe('in `process.cwd()`', () => {
  const cwd = process.cwd();
  const files = ['1.tmp', '2.tmp', '3.tmp', 'n.tmp'];

  beforeEach(async () => {
    // Simulate the process as if `process.cwd() === fixtures`
    const fixtures = path.join(tempy.directory(), 'fixtures');
    await mkdir(fixtures);
    process.chdir(fixtures);

    files.forEach(x => {
      writeFileSync(x);
    });
  });

  afterEach(() => {
    // Move back to the real `process.cwd()`
    process.chdir(cwd);
  });

  it('forces delete files', async () => {
    expect.assertions(5);

    // Setup dummy git repo
    await execa('git', ['init']);
    await execa('git', ['add'].concat(files));

    await forceDel('*.tmp');

    const stagedFiles = await pify(sgf)();

    expect(stagedFiles).toEqual([]);
    expect(existsSync('1.tmp')).toBe(false);
    expect(existsSync('2.tmp')).toBe(false);
    expect(existsSync('3.tmp')).toBe(false);
    expect(existsSync('4.tmp')).toBe(false);
  });

  it('returns absolute paths of deleted files', async () => {
    expect.assertions(1);
    const expected = files.map(x => path.resolve(x));

    const res = await forceDel('*.tmp');

    expect(res).toEqual(expected);
  });

  it('resolves empty array when no files matched', async () => {
    expect.assertions(1);

    const res = await forceDel('*.jpg');

    expect(res).toEqual([]);
  });
});
