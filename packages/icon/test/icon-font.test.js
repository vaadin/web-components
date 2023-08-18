import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-icon.js';
import { iconFontCss } from './test-icon-font.js';

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
      await nextFrame();
    });

    it('should have the same height as the host', () => {
      const fontIconStyle = getComputedStyle(icon, ':before');
      expect(parseInt(fontIconStyle.height)).to.be.closeTo(24, 1);
    });

    it('should resize with the host', () => {
      icon.style.width = '100px';
      icon.style.height = '100px';
      const fontIconStyle = getComputedStyle(icon, ':before');
      expect(parseInt(fontIconStyle.height)).to.be.closeTo(100, 1);
    });
  });
});
