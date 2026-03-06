import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
// Ensure registered custom properties are available
import '@vaadin/component-base/src/styles/style-props.js';

// Load Aura CSS
function loadCSS(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.addEventListener('load', resolve);
    link.addEventListener('error', reject);
    document.head.appendChild(link);
  });
}

function getColor(element, property) {
  return getComputedStyle(element).getPropertyValue(property).trim();
}

/**
 * Get the lightness of a computed color value (0 = dark, 1 = light).
 * Handles both rgb() and oklch() serialization formats.
 */
function getLightness(colorValue) {
  // oklch(L C H) — L is lightness directly (0-1)
  const oklchMatch = colorValue.match(/oklch\(([\d.]+)/u);
  if (oklchMatch) {
    return parseFloat(oklchMatch[1]);
  }

  // rgb(r, g, b) — compute relative luminance approximation
  const rgbMatch = colorValue.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/u);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number);
    return (r + g + b) / 3 / 255;
  }

  throw new Error(`Unrecognized color format: ${colorValue}`);
}

describe('color-scheme', () => {
  before(async () => {
    await loadCSS('/packages/aura/aura.css');
  });

  afterEach(() => {
    document.documentElement.style.removeProperty('color-scheme');
  });

  describe('light mode (default)', () => {
    it('should resolve --aura-background-color to a light color', () => {
      const el = fixtureSync('<div style="background-color: var(--aura-background-color)"></div>');
      expect(getLightness(getColor(el, 'background-color'))).to.be.above(0.8);
    });

    it('should resolve --vaadin-text-color to a dark color', () => {
      const el = fixtureSync('<div style="color: var(--vaadin-text-color)"></div>');
      expect(getLightness(getColor(el, 'color'))).to.be.below(0.3);
    });
  });

  describe('dark mode on document', () => {
    beforeEach(() => {
      document.documentElement.style.setProperty('color-scheme', 'dark');
    });

    it('should resolve --aura-background-color to a dark color', () => {
      const el = fixtureSync('<div style="background-color: var(--aura-background-color)"></div>');
      expect(getLightness(getColor(el, 'background-color'))).to.be.below(0.3);
    });

    it('should resolve --vaadin-text-color to a light color', () => {
      const el = fixtureSync('<div style="color: var(--vaadin-text-color)"></div>');
      expect(getLightness(getColor(el, 'color'))).to.be.above(0.8);
    });
  });

  describe('dark mode on subtree', () => {
    it('should resolve --aura-background-color to a dark color on the subtree element', () => {
      const container = fixtureSync(`
        <div style="color-scheme: dark">
          <div id="inner" style="background-color: var(--aura-background-color)"></div>
        </div>
      `);
      const inner = container.querySelector('#inner');
      expect(getLightness(getColor(inner, 'background-color'))).to.be.below(0.3);
    });

    it('should not affect elements outside the subtree', () => {
      fixtureSync('<div style="color-scheme: dark"></div>');
      const outside = fixtureSync('<div style="background-color: var(--aura-background-color)"></div>');
      expect(getLightness(getColor(outside, 'background-color'))).to.be.above(0.8);
    });
  });

  describe('registered custom properties in subtree dark mode', () => {
    // Known limitation: registered <color> properties (CSS.registerProperty with
    // syntax: '<color>') resolve light-dark() at definition time. Changing
    // color-scheme on a subtree does not trigger recomputation of inherited
    // registered properties. There is no CSS selector for "element has computed
    // color-scheme: dark", so this cannot be fixed without un-registering the
    // properties (which would cause a ~40% rendering performance regression in
    // Chrome due to Aura's complex relative color functions).
    it('does not update --vaadin-background-color in dark subtree (known limitation)', () => {
      const lightEl = fixtureSync('<div></div>');
      const lightBg = getColor(lightEl, '--vaadin-background-color');

      const container = fixtureSync(`
        <div style="color-scheme: dark">
          <div id="inner"></div>
        </div>
      `);
      const inner = container.querySelector('#inner');
      const darkBg = getColor(inner, '--vaadin-background-color');

      // The registered property keeps its light value — update this assertion
      // to .to.not.equal if the limitation is fixed in the future.
      expect(darkBg).to.equal(lightBg);
    });

    it('does not update --vaadin-text-color in dark subtree (known limitation)', () => {
      const lightEl = fixtureSync('<div></div>');
      const lightText = getColor(lightEl, '--vaadin-text-color');

      const container = fixtureSync(`
        <div style="color-scheme: dark">
          <div id="inner"></div>
        </div>
      `);
      const inner = container.querySelector('#inner');
      const darkText = getColor(inner, '--vaadin-text-color');

      // The registered property keeps its light value — update this assertion
      // to .to.not.equal if the limitation is fixed in the future.
      expect(darkText).to.equal(lightText);
    });
  });
});
