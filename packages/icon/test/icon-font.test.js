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
      // Applying an icon font class name to the vaadin-icon element isn't
      // officially supported but it's used here for testing purposes.
      icon = fixtureSync('<vaadin-icon class="icon-before"></vaadin-icon>');
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
      icon.classList.add('custom-line-height');
      const fontIconStyle = getComputedStyle(icon, ':before');
      expect(parseInt(fontIconStyle.height)).to.be.closeTo(24, 1);
    });
  });
});
