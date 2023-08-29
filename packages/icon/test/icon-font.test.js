import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
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

    it('should subtract vertical padding from height', async () => {
      icon.style.padding = '5px';
      await onceResized(icon);
      expect(parseInt(getComputedStyle(icon, ':before').height)).to.be.closeTo(14, 1);

      icon.style.padding = '7px';
      await onceResized(icon);
      expect(parseInt(getComputedStyle(icon, ':before').height)).to.be.closeTo(10, 1);
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

  describe('char', () => {
    let icon;

    it('should reflect char as an attribute', () => {
      icon = fixtureSync('<vaadin-icon font="my-icon-font"></vaadin-icon>');
      icon.char = '\ue900';
      expect(icon.getAttribute('char')).to.equal('\ue900');
    });

    it('should add icon attribute if char is set', () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      icon.char = '\ue900';
      icon.style.fontFamily = 'My icons';
      expect(icon.hasAttribute('icon')).to.be.true;
    });

    it('should not add icon attribute if font is not set', () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      icon.char = null;
      icon.style.fontFamily = 'My icons';
      expect(icon.hasAttribute('icon')).to.be.false;
    });

    it('should not override existing icon', () => {
      icon = fixtureSync('<vaadin-icon icon="foo:bar"></vaadin-icon>');
      icon.char = '\ue900';
      icon.style.fontFamily = 'My icons';
      expect(icon.icon).to.equal('foo:bar');
    });
  });

  describe('fontFamily', () => {
    let icon;

    it('should set font-family for the icon element', () => {
      icon = fixtureSync('<vaadin-icon char="\\e900"></vaadin-icon>');
      icon.fontFamily = 'My icons';
      const fontIconStyle = getComputedStyle(icon, ':before');
      expect(['"My icons"', 'My icons']).to.include(fontIconStyle.fontFamily);
    });
  });

  // These tests make sure that the heavy container query fallback is only used
  // when font icons are used.
  (usesFontIconSizingFallback ? describe : describe.skip)('container query fallback', () => {
    let icon;

    it('should have the custom property (font)', async () => {
      icon = fixtureSync('<vaadin-icon font="foo"></vaadin-icon>');
      await nextFrame();
      expect(icon.style.getPropertyValue('--_vaadin-font-icon-size')).to.equal('24px');
    });

    it('should have the custom property (char)', async () => {
      icon = fixtureSync('<vaadin-icon char="foo"></vaadin-icon>');
      await nextFrame();
      expect(icon.style.getPropertyValue('--_vaadin-font-icon-size')).to.equal('24px');
    });

    it('should not have the custom property', async () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      await nextFrame();
      expect(icon.style.getPropertyValue('--_vaadin-font-icon-size')).to.equal('');
    });

    it('should set the custom property', async () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      await nextFrame();
      icon.font = 'foo';
      expect(icon.style.getPropertyValue('--_vaadin-font-icon-size')).to.equal('24px');
    });

    it('should update the custom property', async () => {
      icon = fixtureSync('<vaadin-icon font="foo"></vaadin-icon>');
      await nextFrame();
      icon.style.width = '100px';
      icon.style.height = '100px';
      await onceResized(icon);
      expect(icon.style.getPropertyValue('--_vaadin-font-icon-size')).to.equal('100px');
    });

    it('should not update the custom property', async () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      await nextFrame();
      icon.style.width = '100px';
      icon.style.height = '100px';
      await nextFrame(icon);
      await nextFrame(icon);
      expect(icon.style.getPropertyValue('--_vaadin-font-icon-size')).to.equal('');
    });
  });
});
