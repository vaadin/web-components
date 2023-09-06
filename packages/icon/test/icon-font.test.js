import { expect } from '@esm-bundle/chai';
import { fixtureSync, isChrome, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-icon.js';
import { needsFontIconSizingFallback, supportsCQUnitsForPseudoElements } from '../src/vaadin-icon-helpers.js';
import { iconFontCss } from './test-icon-font.js';

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
  if (needsFontIconSizingFallback()) {
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

    it('should restore the font to element class list', () => {
      icon = fixtureSync('<vaadin-icon font="my-icon-font icon-before"></vaadin-icon>');
      icon.className = 'foo';
      expect(icon.classList.contains('my-icon-font')).to.be.true;
      expect(icon.classList.contains('icon-before')).to.be.true;
      expect(icon.classList.contains('foo')).to.be.true;
    });

    it('should restore the missing font to element class list', () => {
      icon = fixtureSync('<vaadin-icon font="my-icon-font icon-before"></vaadin-icon>');
      icon.className = 'my-icon-font';
      expect(icon.classList.contains('my-icon-font')).to.be.true;
      expect(icon.classList.contains('icon-before')).to.be.true;
    });

    it('should restore the removed font to element class list', () => {
      icon = fixtureSync('<vaadin-icon font="my-icon-font icon-before"></vaadin-icon>');
      icon.classList.remove('my-icon-font');
      expect(icon.classList.contains('my-icon-font')).to.be.true;
      expect(icon.classList.contains('icon-before')).to.be.true;
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

    it('should reflect unprefixed char as font-icon-content attribute', () => {
      icon = fixtureSync('<vaadin-icon font="my-icon-font"></vaadin-icon>');
      icon.char = 'e900';
      expect(icon.getAttribute('font-icon-content')).to.equal('\ue900');
    });

    it('should reflect prefixed char as font-icon-content attribute', () => {
      icon = fixtureSync('<vaadin-icon font="my-icon-font"></vaadin-icon>');
      icon.char = '\ue900';
      expect(icon.getAttribute('font-icon-content')).to.equal('\ue900');
    });

    it('should remove font-icon-content attribute', () => {
      icon = fixtureSync('<vaadin-icon font="my-icon-font"></vaadin-icon>');
      icon.char = 'e900';
      icon.char = null;
      expect(icon.hasAttribute('font-icon-content')).to.be.false;
    });

    it('should add icon attribute if char is set', () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      icon.char = '\ue900';
      icon.style.fontFamily = 'My icons';
      expect(icon.hasAttribute('icon')).to.be.true;
    });

    it('should not add icon attribute if char is not set', () => {
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

  describe('ligature', () => {
    let icon;

    it('should reflect ligature as font-icon-content attribute', () => {
      icon = fixtureSync('<vaadin-icon font="my-icon-font"></vaadin-icon>');
      icon.ligature = 'foo';
      expect(icon.getAttribute('font-icon-content')).to.equal('foo');
    });

    it('should remove font-icon-content attribute', () => {
      icon = fixtureSync('<vaadin-icon font="my-icon-font"></vaadin-icon>');
      icon.ligature = 'foo';
      icon.ligature = null;
      expect(icon.hasAttribute('font-icon-content')).to.be.false;
    });

    it('should add icon attribute if ligature is set', () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      icon.ligature = '\ue900';
      icon.style.fontFamily = 'My icons';
      expect(icon.hasAttribute('icon')).to.be.true;
    });

    it('should not add icon attribute if ligature is not set', () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      icon.ligature = null;
      icon.style.fontFamily = 'My icons';
      expect(icon.hasAttribute('icon')).to.be.false;
    });

    it('should not override existing icon', () => {
      icon = fixtureSync('<vaadin-icon icon="foo:bar"></vaadin-icon>');
      icon.ligature = 'foo';
      icon.style.fontFamily = 'My icons';
      expect(icon.icon).to.equal('foo:bar');
    });
  });

  describe('fontFamily', () => {
    let icon;

    it('should set font-family for the icon element', () => {
      icon = fixtureSync('<vaadin-icon char="e900"></vaadin-icon>');
      icon.fontFamily = 'My icons';
      const fontIconStyle = getComputedStyle(icon, ':before');
      expect(['"My icons"', 'My icons']).to.include(fontIconStyle.fontFamily);
    });
  });

  // These tests make sure that the heavy container query fallback is only used
  // when font icons are used.
  describe('container query fallback', () => {
    // Tests for browsers that require the fallback
    const fallBackIt = needsFontIconSizingFallback() ? it : it.skip;
    // Tests for browsers that we know for sure not to require the fallback
    const supportedIt = isChrome ? it : it.skip;

    let icon;

    supportedIt('should support CQ width units on pseudo elements', async () => {
      expect(supportsCQUnitsForPseudoElements()).to.be.true;
    });

    supportedIt('should not need the fallback', async () => {
      expect(needsFontIconSizingFallback()).to.be.false;
    });

    fallBackIt('should not support CQ width units on pseudo elements', async () => {
      expect(supportsCQUnitsForPseudoElements()).to.be.false;
    });

    fallBackIt('should have the custom property (font)', async () => {
      icon = fixtureSync('<vaadin-icon font="foo"></vaadin-icon>');
      await nextFrame();
      expect(icon.style.getPropertyValue('--_vaadin-font-icon-size')).to.equal('24px');
    });

    fallBackIt('should have the custom property (char)', async () => {
      icon = fixtureSync('<vaadin-icon char="foo"></vaadin-icon>');
      await nextFrame();
      expect(icon.style.getPropertyValue('--_vaadin-font-icon-size')).to.equal('24px');
    });

    fallBackIt('should not have the custom property', async () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      await nextFrame();
      expect(icon.style.getPropertyValue('--_vaadin-font-icon-size')).to.equal('');
    });

    fallBackIt('should set the custom property', async () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      await nextFrame();
      icon.font = 'foo';
      expect(icon.style.getPropertyValue('--_vaadin-font-icon-size')).to.equal('24px');
    });

    fallBackIt('should update the custom property', async () => {
      icon = fixtureSync('<vaadin-icon font="foo"></vaadin-icon>');
      await nextFrame();
      icon.style.width = '100px';
      icon.style.height = '100px';
      await onceResized(icon);
      expect(icon.style.getPropertyValue('--_vaadin-font-icon-size')).to.equal('100px');
    });

    fallBackIt('should not update the custom property', async () => {
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
