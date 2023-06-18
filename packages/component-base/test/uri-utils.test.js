import { expect } from '@esm-bundle/chai';
import { arePathsMatching } from '../src/uri-utils.js';

describe('url-utils', () => {
  describe('arePathsMatching', () => {
    const paths = ['', '/', '/path', 'base/path'];

    it('should return true when paths match', () => {
      paths.forEach((path) => expect(arePathsMatching(path, path)).to.be.true);
    });

    it('should return false when paths do not match', () => {
      expect(arePathsMatching('/path1', '/path2')).to.be.false;
    });

    it('should return true if only one of the paths has trailing and leading spaces', () => {
      paths.forEach((path) => {
        const pathWithExtraSpace = ` ${path} `;
        expect(arePathsMatching(pathWithExtraSpace, path)).to.be.true;
        expect(arePathsMatching(path, pathWithExtraSpace)).to.be.true;
      });
    });

    it('should return true if only one of the paths has a leading slash', () => {
      paths.forEach((path) => {
        const pathWithoutLeadingSlash = path.startsWith('/') ? path.substring(1) : path;
        const pathWithLeadingSlash = path.startsWith('/') ? path : `/${path}`;
        expect(arePathsMatching(pathWithoutLeadingSlash, pathWithLeadingSlash)).to.be.true;
        expect(arePathsMatching(pathWithLeadingSlash, pathWithoutLeadingSlash)).to.be.true;
      });
    });
  });
});
