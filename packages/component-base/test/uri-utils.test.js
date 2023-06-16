import { expect } from '@esm-bundle/chai';
import { isMatchingPath } from '../src/uri-utils.js';

describe('path matching', () => {
  const pathOptions = ['', '/', '/path', 'base/path'];

  it('should return true if any path in the array matches', () => {
    pathOptions.forEach((path) => expect(isMatchingPath(path, pathOptions)).to.be.true);
  });

  it('should return true if only one of the paths has trailing and leading spaces', () => {
    pathOptions.forEach((path) => {
      const pathWithExtraSpace = ` ${path} `;
      expect(isMatchingPath(pathWithExtraSpace, [path])).to.be.true;
      expect(isMatchingPath(path, [pathWithExtraSpace])).to.be.true;
    });
  });

  it('should return true if only one of the paths has a leading slash', () => {
    pathOptions.forEach((path) => {
      const pathWithoutLeadingSlash = path.startsWith('/') ? path.substring(1) : path;
      const pathWithLeadingSlash = path.startsWith('/') ? path : `/${path}`;
      expect(isMatchingPath(pathWithoutLeadingSlash, [pathWithLeadingSlash])).to.be.true;
      expect(isMatchingPath(pathWithLeadingSlash, [pathWithoutLeadingSlash])).to.be.true;
    });
  });

  it('should return false if paths are not defined', () => {
    expect(isMatchingPath('', undefined)).to.be.false;
  });

  it('should return false if paths are empty', () => {
    expect(isMatchingPath('', [])).to.be.false;
  });

  it('should return false if path to match is undefined', () => {
    expect(isMatchingPath(undefined, undefined)).to.be.false;
  });
});
