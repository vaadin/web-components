import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { matchPaths } from '../src/url-utils.js';

describe('url-utils', () => {
  describe('comparePaths', () => {
    const paths = ['', '/', '/path', 'base/path'];

    it('should return true when paths match', () => {
      paths.forEach((path) => expect(matchPaths(path, path)).to.be.true);
    });

    it('should return false when paths do not match', () => {
      expect(matchPaths('/path1', '/path2')).to.be.false;
    });

    it('should ignore leading and trailing spaces in paths', () => {
      paths.forEach((path) => {
        const pathWithExtraSpace = ` ${path} `;
        expect(matchPaths(pathWithExtraSpace, path)).to.be.true;
        expect(matchPaths(path, pathWithExtraSpace)).to.be.true;
      });
    });

    it('should ignore a leading slash in paths', () => {
      paths.forEach((path) => {
        const pathWithoutLeadingSlash = path.startsWith('/') ? path.substring(1) : path;
        const pathWithLeadingSlash = path.startsWith('/') ? path : `/${path}`;
        expect(matchPaths(pathWithoutLeadingSlash, pathWithLeadingSlash)).to.be.true;
        expect(matchPaths(pathWithLeadingSlash, pathWithoutLeadingSlash)).to.be.true;
      });
    });

    describe('base url', () => {
      let baseUri;

      beforeEach(() => {
        baseUri = sinon.stub(document, 'baseURI');
      });

      afterEach(() => {
        baseUri.restore();
      });

      it('should use document.baseURI as a base url', () => {
        baseUri.value('https://vaadin.com/docs/');
        expect(matchPaths('https://vaadin.com/docs/components', 'components')).to.be.true;
      });
    });
  });
});
