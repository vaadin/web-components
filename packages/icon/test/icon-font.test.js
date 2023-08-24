import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-icon.js';
import { isSafari } from '@vaadin/component-base/src/browser-utils.js';
import { iconFontCss } from './test-icon-font.js';

const usesFontIconSizingFallback = !CSS.supports('container-type: inline-size') || isSafari;

/**
 * Resolves once the function is invoked on the given object.
 */
function onceInvoked(object, functionName) {
  return new Promise((resolve) => {
    sinon.replace(object, functionName, (...args) => {
      sinon.restore();
      object[functionName](...args);
      resolve();
    });
  });
}

/**
 * Resolves once the icon resize is complete.
 */
async function onceResized(icon) {
  if (usesFontIconSizingFallback) {
    await onceInvoked(icon, '_onResize');
  }
}

describe('vaadin-icon - icon fonts', () => {
  beforeEach(() => {
    fixtureSync(`
      <style>
        ${iconFontCss}
      </style>
    `);
  });

  describe('sizing', () => {
    let icon;

    beforeEach(async () => {
      icon = fixtureSync('<vaadin-icon font="my-icon-font icon-before"></vaadin-icon>');
      await onceResized(icon);
    });

    it('should have the same height as the host', () => {
      const fontIconStyle = getComputedStyle(icon, ':before');
      expect(parseInt(fontIconStyle.height)).to.be.closeTo(24, 1);
    });

    it('should resize with the host', async () => {
      icon.style.width = '100px';
      icon.style.height = '100px';
      await onceResized(icon);
      const fontIconStyle = getComputedStyle(icon, ':before');
      expect(parseInt(fontIconStyle.height)).to.be.closeTo(100, 1);
    });

    it('should not overflow host - wider icon', async () => {
      icon.style.width = '150px';
      icon.style.height = '100px';
      await onceResized(icon);
      const fontIconStyle = getComputedStyle(icon, ':before');
      expect(parseInt(fontIconStyle.height)).to.be.closeTo(100, 1);
    });

    it('should not overflow host - line height', async () => {
      const fontIconStyle = getComputedStyle(icon, ':before');
      expect(parseInt(fontIconStyle.height)).to.be.closeTo(24, 1);
    });
  });

  describe('font', () => {
    let icon;

    it('should add the font to element class list', () => {
      icon = fixtureSync('<vaadin-icon font="my-icon-font icon-before"></vaadin-icon>');
      expect(icon.classList.contains('my-icon-font')).to.be.true;
      expect(icon.classList.contains('icon-before')).to.be.true;
    });

    it('should not overwrite existing classes', () => {
      icon = fixtureSync('<vaadin-icon class="foo"></vaadin-icon>');
      icon.font = 'my-icon-font icon-before';
      expect(icon.classList.contains('foo')).to.be.true;
    });

    it('should change font classes', () => {
      icon = fixtureSync('<vaadin-icon class="foo" font="my-icon-font icon-before"></vaadin-icon>');
      icon.font = 'my-icon-font icon-after';
      expect(icon.classList.contains('icon-before')).to.be.false;
      expect(icon.classList.contains('icon-after')).to.be.true;
    });

    it('should remove all font classes', () => {
      icon = fixtureSync('<vaadin-icon class="foo" font="my-icon-font icon-before"></vaadin-icon>');
      icon.font = '';
      expect(icon.classList.contains('my-icon-font')).to.be.false;
      expect(icon.classList.contains('icon-before')).to.be.false;
      expect(icon.classList.contains('foo')).to.be.true;
    });

    it('should reflect font as an attribute', () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      icon.font = 'my-icon-font icon-before';
      expect(icon.getAttribute('font')).to.equal('my-icon-font icon-before');
    });

    it('should add icon attribute if font is set', () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      icon.font = 'my-icon-font icon-before';
      expect(icon.hasAttribute('icon')).to.be.true;
    });

    it('should not add icon attribute if font is not set', () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      icon.font = null;
      expect(icon.hasAttribute('icon')).to.be.false;
    });

    it('should not override existing icon', () => {
      icon = fixtureSync('<vaadin-icon icon="foo:bar"></vaadin-icon>');
      icon.font = 'my-icon-font icon-before';
      expect(icon.icon).to.equal('foo:bar');
    });
  });
});
