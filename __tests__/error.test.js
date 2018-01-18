'use strict';

jest.mock('execa');

const execa = require('execa');
const fixtures = require('fixturez');

const forceDel = require('../');

const f = fixtures(__dirname);

describe('errors', () => {
  afterEach(() => {
    execa.mockClear();
  });

  it("doesn't handle non-git related errors", async () => {
    expect.assertions(1);

    // eslint-disable-next-line prefer-promise-reject-errors
    execa.mockImplementation(() => Promise.reject({ stderr: 'Oops' }));
    const tmpPath = f.copy('fixtures');

    await expect(forceDel('foo', { cwd: tmpPath })).rejects.toThrow();
  });
});
