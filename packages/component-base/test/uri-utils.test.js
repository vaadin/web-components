import { expect } from '@esm-bundle/chai';
import { isMatchingPath } from '../src/uri-utils.js';

describe('url-utils', () => {
  describe('isMatchingPath', () => {
  const pathOptions = ['', '/', '/path', 'base/path'];

  it('should return true if the paths match', () => {
    pathOptions.forEach((path) => expect(isMatchingPath(path, path)).to.be.true);
  });

  it('should return true if the paths do not match', () => {
    expect(isMatchingPath('/path1', '/path2')).to.be.false;
  });

  it('should return true if only one of the paths has trailing and leading spaces', () => {
    pathOptions.forEach((path) => {
      const pathWithExtraSpace = ` ${path} `;
      expect(isMatchingPath(pathWithExtraSpace, path)).to.be.true;
      expect(isMatchingPath(path, pathWithExtraSpace)).to.be.true;
    });
  });

  it('should return true if only one of the paths has a leading slash', () => {
    pathOptions.forEach((path) => {
      const pathWithoutLeadingSlash = path.startsWith('/') ? path.substring(1) : path;
      const pathWithLeadingSlash = path.startsWith('/') ? path : `/${path}`;
      expect(isMatchingPath(pathWithoutLeadingSlash, pathWithLeadingSlash)).to.be.true;
      expect(isMatchingPath(pathWithLeadingSlash, pathWithoutLeadingSlash)).to.be.true;
    });
  });
});
