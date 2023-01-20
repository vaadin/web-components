import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { isValidSvg } from '../src/vaadin-icon-svg.js';
import { Iconset } from '../vaadin-iconset.js';

describe('vaadin-iconset', () => {
  let iconset;

  beforeEach(() => {
    iconset = fixtureSync(`
      <vaadin-iconset name="vaadin" size="16">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <g id="vaadin:caret-down"><path d="M3 4h10l-5 7z"></path></g>
            <g id="caret-up"><path d="M13 12h-10l5-7z"></path></g>
          </defs>
        </svg>
      </vaadin-iconset>
    `);
  });

  describe('getIconSvg', () => {
    it('should return svg literal when called with correct id', () => {
      const { svg } = Iconset.getIconSvg('caret-down', 'vaadin');
      expect(isValidSvg(svg)).to.be.true;
    });

    it('should return svg literal when called with prefixed id', () => {
      const { svg } = Iconset.getIconSvg('vaadin:caret-down');
      expect(isValidSvg(svg)).to.be.true;
    });

    it('should return svg literal when called with non-prefixed id', () => {
      const { svg } = Iconset.getIconSvg('caret-up', 'vaadin');
      expect(isValidSvg(svg)).to.be.true;
    });

    it('should return empty svg when called with incorrect id', () => {
      const { svg } = Iconset.getIconSvg('non-existent');
      expect(isValidSvg(svg)).to.be.true;
      expect(svg).to.be.a('symbol');
    });

    it('should return default iconset size value when called', () => {
      const { size } = Iconset.getIconSvg('caret-down', 'vaadin');
      expect(size).to.equal(16);
    });

    it('should return new iconset size after it is changed', () => {
      iconset.size = 1000;
      const { size } = Iconset.getIconSvg('caret-down', 'vaadin');
      expect(size).to.equal(1000);
    });
  });

  describe('getIconset', () => {
    it('should return the existing instance when getIconset with taken name', () => {
      const result = Iconset.getIconset('vaadin');
      expect(result).to.equal(iconset);
    });

    it('should return the same instance when iconset name has changed', () => {
      iconset.name = 'custom';
      const result = Iconset.getIconset('custom');
      expect(result).to.equal(iconset);
    });

    it('should return the new instance for old name after iconset change', () => {
      iconset.name = 'custom';
      const result = Iconset.getIconset('vaadin');
      expect(result).to.not.equal(iconset);
    });
  });
});
