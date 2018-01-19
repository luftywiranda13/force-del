'use strict';

jest.mock('execa');

const execa = require('execa');
const fixtures = require('fixturez');

const forceDel = require('../');

const f = fixtures(__dirname);

describe('error', () => {
  afterEach(() => {
    execa.mockClear();
  });

  it('throws if process limit exceeded', async () => {
    expect.assertions(1);

    execa.mockImplementation(() => {
      return Promise.reject(new Error('spawn git EAGAIN'));
    });

    const tmpPath = f.copy('fixtures');

    await expect(forceDel('foo', { cwd: tmpPath })).rejects.toThrow();
  });

  it("doesn't handle non-git related error", async () => {
    expect.assertions(1);

    // eslint-disable-next-line prefer-promise-reject-errors
    execa.mockImplementation(() => Promise.reject({ stderr: 'Oops' }));
    const tmpPath = f.copy('fixtures');

    await expect(forceDel('foo', { cwd: tmpPath })).rejects.toThrow();
  });
});
