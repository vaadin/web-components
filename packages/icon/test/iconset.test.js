import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { Iconset } from '../vaadin-iconset.js';
import { isValidSvg } from '../src/vaadin-icon-svg.js';

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

  describe('applyIcon', () => {
    it('should return svg literal when called with correct id', () => {
      const { svg } = iconset.applyIcon('caret-down');
      expect(isValidSvg(svg)).to.be.true;
    });

    it('should return svg literal when called with prefixed id', () => {
      const { svg } = iconset.applyIcon('vaadin:caret-down');
      expect(isValidSvg(svg)).to.be.true;
    });

    it('should return svg literal when called with non-prefixed id', () => {
      const { svg } = iconset.applyIcon('caret-up');
      expect(isValidSvg(svg)).to.be.true;
    });

    it('should return empty svg when called with incorrect id', () => {
      const { svg } = iconset.applyIcon('non-existent');
      expect(isValidSvg(svg)).to.be.true;
      expect(svg).to.be.a('symbol');
    });

    it('should return default iconset size value when called', () => {
      const { size } = iconset.applyIcon('caret-down');
      expect(size).to.equal(16);
    });

    it('should return new iconset size after it is changed', () => {
      iconset.size = 1000;
      const { size } = iconset.applyIcon('caret-down');
      expect(size).to.equal(1000);
    });
  });

  describe('getIconset', () => {
    it('should return the existing instance when getIconset with taken name', () => {
      const result = Iconset.getIconset('vaadin');
      expect(result).to.equal(iconset);
    });

    it('should return the new instance when getIconset with not taken name', () => {
      const result = Iconset.getIconset('other');
      expect(result instanceof Iconset).to.be.true;
      expect(result).to.not.equal(iconset);
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
