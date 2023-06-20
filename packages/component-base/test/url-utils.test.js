import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { arePathsMatching } from '../src/url-utils.js';

describe('url-utils', () => {
  describe('arePathsMatching', () => {
    const paths = ['', '/', '/path', 'base/path'];

    it('should return true when paths match', () => {
      paths.forEach((path) => expect(arePathsMatching(path, path)).to.be.true);
    });

    it('should return false when paths do not match', () => {
      expect(arePathsMatching('/path1', '/path2')).to.be.false;
    });

    it('should ignore leading and trailing spaces in paths', () => {
      paths.forEach((path) => {
        const pathWithExtraSpace = ` ${path} `;
        expect(arePathsMatching(pathWithExtraSpace, path)).to.be.true;
        expect(arePathsMatching(path, pathWithExtraSpace)).to.be.true;
      });
    });

    it('should ignore a leading slash in paths', () => {
      paths.forEach((path) => {
        const pathWithoutLeadingSlash = path.startsWith('/') ? path.substring(1) : path;
        const pathWithLeadingSlash = path.startsWith('/') ? path : `/${path}`;
        expect(arePathsMatching(pathWithoutLeadingSlash, pathWithLeadingSlash)).to.be.true;
        expect(arePathsMatching(pathWithLeadingSlash, pathWithoutLeadingSlash)).to.be.true;
      });
    });

    it('should use document.baseURI as a base url', () => {
      sinon.stub(document, 'baseURI').value('https://vaadin.com/docs');
      expect(arePathsMatching('https://vaadin.com/docs/components', 'components')).to.be.true;
    });
  });
});
