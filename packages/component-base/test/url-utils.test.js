import { expect } from '@vaadin/chai-plugins';
import sinon from 'sinon';
import { matchPaths } from '../src/url-utils.js';

describe('url-utils', () => {
  describe('matchPaths', () => {
    let documentBaseURI;

    const paths = ['', '/', '/path', 'base/path'];

    beforeEach(() => {
      documentBaseURI = sinon.stub(document, 'baseURI').value('http://localhost/');
    });

    afterEach(() => {
      documentBaseURI.restore();
    });

    it('should return true when paths match', () => {
      paths.forEach((path) => expect(matchPaths(path, path)).to.be.true);
    });

    it('should return false when paths do not match', () => {
      expect(matchPaths('/path1', '/path2')).to.be.false;
    });

    it('should return false when passing an external URL', () => {
      expect(matchPaths('/', 'https://vaadin.com')).to.be.false;
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

    it('should use document.baseURI as a base url', () => {
      documentBaseURI.value('https://vaadin.com/docs/');
      expect(matchPaths('https://vaadin.com/docs/components', 'components')).to.be.true;
    });

    describe('matchNested option', () => {
      it('should match the exact path by default', () => {
        expect(matchPaths('/users', '/users')).to.be.true;
        expect(matchPaths('/users/', '/users')).to.be.false;
        expect(matchPaths('/users/john', '/users')).to.be.false;
        expect(matchPaths('/usersessions', '/users')).to.be.false;
      });

      it('should match the exact path when matchNested is false', () => {
        expect(matchPaths('/users', '/users', { matchNested: false })).to.be.true;
        expect(matchPaths('/users/', '/users', { matchNested: false })).to.be.false;
        expect(matchPaths('/users/john', '/users', { matchNested: false })).to.be.false;
        expect(matchPaths('/usersessions', '/users', { matchNested: false })).to.be.false;
      });

      it('should match nested paths when matchNested is true', () => {
        expect(matchPaths('/users', '/users', { matchNested: true })).to.be.true;
        expect(matchPaths('/users/', '/users', { matchNested: true })).to.be.true;
        expect(matchPaths('/users/john', '/users', { matchNested: true })).to.be.true;
        expect(matchPaths('/usersessions', '/users', { matchNested: true })).to.be.false;
      });
    });

    describe('query params', () => {
      it('should return true when query params match', () => {
        expect(matchPaths('/products', '/products')).to.be.true;
        expect(matchPaths('/products?c=socks', '/products')).to.be.true;
        expect(matchPaths('/products?c=pants', '/products')).to.be.true;
        expect(matchPaths('/products?c=', '/products')).to.be.true;
        expect(matchPaths('/products?c=socks&item=5', '/products')).to.be.true;
        expect(matchPaths('/products?item=5&c=socks', '/products')).to.be.true;
        expect(matchPaths('/products?c=socks&c=pants', '/products')).to.be.true;
        expect(matchPaths('/products?socks', '/products')).to.be.true;
        expect(matchPaths('/products?socks=', '/products')).to.be.true;

        expect(matchPaths('/products?c=socks', '/products?c=socks')).to.be.true;
        expect(matchPaths('/products?c=socks&item=5', '/products?c=socks')).to.be.true;
        expect(matchPaths('/products?item=5&c=socks', '/products?c=socks')).to.be.true;
        expect(matchPaths('/products?c=socks&c=pants', '/products?c=socks')).to.be.true;

        expect(matchPaths('/products?c=', '/products?c=')).to.be.true;

        expect(matchPaths('/products?c=socks&c=pants', '/products?c=socks&c=pants')).to.be.true;

        expect(matchPaths('/products?socks', '/products?socks')).to.be.true;
        expect(matchPaths('/products?socks=', '/products?socks')).to.be.true;
      });

      it('should return false when query params do not match', () => {
        expect(matchPaths('/products', '/products?c=socks')).to.be.false;
        expect(matchPaths('/products?c=pants', '/products?c=socks')).to.be.false;
        expect(matchPaths('/products?c=', '/products?c=socks')).to.be.false;
        expect(matchPaths('/products?socks', '/products?c=socks')).to.be.false;
        expect(matchPaths('/products?socks=', '/products?c=socks')).to.be.false;

        expect(matchPaths('/products', '/products?c=')).to.be.false;
        expect(matchPaths('/products?c=socks', '/products?c=')).to.be.false;
        expect(matchPaths('/products?c=pants', '/products?c=')).to.be.false;
        expect(matchPaths('/products?c=socks&item=5', '/products?c=')).to.be.false;
        expect(matchPaths('/products?item=5&c=socks', '/products?c=')).to.be.false;
        expect(matchPaths('/products?c=socks&c=pants', '/products?c=')).to.be.false;
        expect(matchPaths('/products?socks', '/products?c=')).to.be.false;
        expect(matchPaths('/products?socks=', '/products?c=')).to.be.false;

        expect(matchPaths('/products', '/products?c=socks&c=pants')).to.be.false;
        expect(matchPaths('/products?c=socks', '/products?c=socks&c=pants')).to.be.false;
        expect(matchPaths('/products?c=pants', '/products?c=socks&c=pants')).to.be.false;
        expect(matchPaths('/products?c=', '/products?c=socks&c=pants')).to.be.false;
        expect(matchPaths('/products?c=socks&item=5', '/products?c=socks&c=pants')).to.be.false;
        expect(matchPaths('/products?item=5&c=socks', '/products?c=socks&c=pants')).to.be.false;
        expect(matchPaths('/products?socks', '/products?c=socks&c=pants')).to.be.false;
        expect(matchPaths('/products?socks=', '/products?c=socks&c=pants')).to.be.false;

        expect(matchPaths('/products', '/products?socks')).to.be.false;
        expect(matchPaths('/products?c=socks', '/products?socks')).to.be.false;
        expect(matchPaths('/products?c=pants', '/products?socks')).to.be.false;
        expect(matchPaths('/products?c=', '/products?socks')).to.be.false;
        expect(matchPaths('/products?c=socks&item=5', '/products?socks')).to.be.false;
        expect(matchPaths('/products?item=5&c=socks', '/products?socks')).to.be.false;
        expect(matchPaths('/products?c=socks&c=pants', '/products?socks')).to.be.false;
      });
    });
  });
});
