import { expect } from '@esm-bundle/chai';
import { isMatchingPath } from '../src/vaadin-side-nav-helpers.js';

describe('path matching', () => {
  const pathOptions = ['', '/', '/path', 'base/path'];

  describe('with item path', () => {
    it('should return true if item path matches', () => {
      pathOptions.forEach((path) => expect(isMatchingPath(path, path, undefined)).to.be.true);
    });

    it('should return true if item path matches with different trailing or leading spaces', () => {
      pathOptions.forEach((path) => {
        const pathWithExtraSpace = ` ${path} `;
        expect(isMatchingPath(pathWithExtraSpace, path, undefined)).to.be.true;
        expect(isMatchingPath(path, pathWithExtraSpace, undefined)).to.be.true;
      });
    });

    it('should return true if item path matches even with different leading slashes', () => {
      pathOptions.forEach((path) => {
        const pathWithLeadingSlash = path.startsWith('/') ? path : `/${path}`;
        const pathWithoutLeadingSlash = path.startsWith('/') ? path.substring(1) : path;
        expect(isMatchingPath(pathWithLeadingSlash, pathWithoutLeadingSlash, undefined)).to.be.true;
        expect(isMatchingPath(pathWithoutLeadingSlash, pathWithLeadingSlash, undefined)).to.be.true;
      });
    });

    it('should return true if one of the aliases match the path', () => {
      const combinedPathOptions = pathOptions.join();
      pathOptions.forEach((path) => expect(isMatchingPath(path, '/otherPath', combinedPathOptions)).to.be.true);
    });

    it('should return true if one of the aliases match the path with different trailing and leading spaces', () => {
      const combinedPathOptionsWithSpace = pathOptions.join(' , ');
      pathOptions.forEach(
        (path) => expect(isMatchingPath(path, '/otherPath', ` ${combinedPathOptionsWithSpace} `)).to.be.true,
      );
    });

    it('should return true if one of the aliases match the path with different leading slashes', () => {
      const combinedPathOptionsWithoutLeadingSlash = pathOptions
        .map((path) => (path.startsWith('/') ? path.substring(1) : path))
        .join();
      pathOptions.forEach((path) => {
        const pathWithLeadingSlash = path.startsWith('/') ? path : `/${path}`;
        expect(isMatchingPath(pathWithLeadingSlash, '/otherPath', combinedPathOptionsWithoutLeadingSlash)).to.be.true;
      });
      const combinedPathOptionsWithLeadingSlash = pathOptions
        .map((path) => (path.startsWith('/') ? path : `/${path}`))
        .join();
      pathOptions.forEach((path) => {
        const pathWithoutLeadingSlash = path.startsWith('/') ? path.substring(1) : path;
        expect(isMatchingPath(pathWithoutLeadingSlash, '/otherPath', combinedPathOptionsWithLeadingSlash)).to.be.true;
      });
    });
  });

  describe('without item path', () => {
    it('should return false if item path is not defined', () => {
      pathOptions.forEach((path) => expect(isMatchingPath(path, undefined, undefined)).to.be.false);
    });

    it('should return false if an alias matches the path but item path is not defined', () => {
      pathOptions.forEach((path) => expect(isMatchingPath(path, undefined, path)).to.be.false);
    });
  });
});
