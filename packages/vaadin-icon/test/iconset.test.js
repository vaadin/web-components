import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { nothing } from 'lit';
import { isTemplateResult, TemplateResultType } from 'lit/directive-helpers.js';
import { IconsetElement } from '../vaadin-iconset.js';

describe('vaadin-iconset', () => {
  let iconset;

  beforeEach(() => {
    iconset = fixtureSync(`
      <vaadin-iconset name="vaadin">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <g id="vaadin-icon:caret-down"><path d="M3 4h10l-5 7z"></path></g>
            <g id="caret-up"><path d="M13 12h-10l5-7z"></path></g>
          </defs>
        </svg>
      </vaadin-iconset>
    `);
  });

  describe('applyIcon', () => {
    it('should return svg literal when applyIcon called with correct id', () => {
      const icon = iconset.applyIcon('caret-down');
      expect(isTemplateResult(icon, TemplateResultType.SVG)).to.be.true;
    });

    it('should return svg literal when applyIcon called with prefixed id', () => {
      const icon = iconset.applyIcon('vaadin-icon:caret-down');
      expect(isTemplateResult(icon, TemplateResultType.SVG)).to.be.true;
    });

    it('should return svg literal when applyIcon called with non-prefixed id', () => {
      const icon = iconset.applyIcon('caret-up');
      expect(isTemplateResult(icon, TemplateResultType.SVG)).to.be.true;
    });

    it('should return nothing when applyIcon is called with incorrect id', () => {
      const icon = iconset.applyIcon('non-existent');
      expect(icon).to.equal(nothing);
    });
  });

  describe('getIconset', () => {
    it('should return the existing instance when getIconset with taken name', () => {
      const result = IconsetElement.getIconset('vaadin');
      expect(result).to.equal(iconset);
    });

    it('should return the new instance when getIconset with not taken name', () => {
      const result = IconsetElement.getIconset('other');
      expect(result instanceof IconsetElement).to.be.true;
      expect(result).to.not.equal(iconset);
    });

    it('should return the same instance when iconset name has changed', () => {
      iconset.name = 'custom';
      const result = IconsetElement.getIconset('custom');
      expect(result).to.equal(iconset);
    });
  });
});
