import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
// Ensure registered custom properties are available
import '@vaadin/component-base/src/styles/style-props.js';

// Load Lumo CSS
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

const WHITE = 'rgb(255, 255, 255)';

describe('color-scheme', () => {
  before(async () => {
    await loadCSS('/packages/vaadin-lumo-styles/src/props/index.css');
    await loadCSS('/packages/vaadin-lumo-styles/src/global/index.css');
  });

  afterEach(() => {
    document.documentElement.removeAttribute('theme');
  });

  describe('light mode (default)', () => {
    it('should resolve --lumo-base-color to white', () => {
      const el = fixtureSync('<div style="background-color: var(--lumo-base-color)"></div>');
      expect(getColor(el, 'background-color')).to.equal(WHITE);
    });

    it('should resolve --lumo-contrast to a dark shade', () => {
      const el = fixtureSync('<div style="color: var(--lumo-contrast)"></div>');
      expect(getColor(el, 'color')).to.not.equal(WHITE);
    });
  });

  describe('dark mode on document', () => {
    beforeEach(() => {
      document.documentElement.setAttribute('theme', 'dark');
    });

    it('should resolve --lumo-base-color to a dark color', () => {
      const el = fixtureSync('<div style="background-color: var(--lumo-base-color)"></div>');
      expect(getColor(el, 'background-color')).to.not.equal(WHITE);
    });

    it('should resolve --lumo-contrast to a light tint', () => {
      const el = fixtureSync('<div style="background-color: var(--lumo-contrast)"></div>');
      // In dark mode, contrast flips to tint (light values)
      expect(getColor(el, 'background-color')).to.not.equal('rgba(0, 0, 0, 0)');
    });
  });

  describe('dark mode on subtree', () => {
    it('should resolve --lumo-base-color to a dark color on the subtree element', () => {
      const container = fixtureSync(`
        <div theme="dark">
          <div id="inner" style="background-color: var(--lumo-base-color)"></div>
        </div>
      `);
      const inner = container.querySelector('#inner');
      expect(getColor(inner, 'background-color')).to.not.equal(WHITE);
    });

    it('should resolve --lumo-contrast to tint values on the subtree element', () => {
      // Get light contrast value for comparison
      const lightEl = fixtureSync('<div style="background-color: var(--lumo-contrast)"></div>');
      const lightContrast = getColor(lightEl, 'background-color');

      const container = fixtureSync(`
        <div theme="dark">
          <div id="inner" style="background-color: var(--lumo-contrast)"></div>
        </div>
      `);
      const inner = container.querySelector('#inner');
      const darkContrast = getColor(inner, 'background-color');

      // Dark contrast (tint) should differ from light contrast (shade)
      expect(darkContrast).to.not.equal(lightContrast);
    });

    it('should not affect elements outside the subtree', () => {
      fixtureSync('<div theme="dark"></div>');
      const outside = fixtureSync('<div style="background-color: var(--lumo-base-color)"></div>');
      expect(getColor(outside, 'background-color')).to.equal(WHITE);
    });
  });

  describe('registered custom properties in subtree dark mode', () => {
    it('should update --vaadin-background-color in dark subtree', () => {
      // Get light value
      const lightEl = fixtureSync('<div></div>');
      const lightBg = getColor(lightEl, '--vaadin-background-color');

      // Get dark subtree value
      const container = fixtureSync(`
        <div theme="dark">
          <div id="inner"></div>
        </div>
      `);
      const inner = container.querySelector('#inner');
      const darkBg = getColor(inner, '--vaadin-background-color');

      expect(darkBg).to.not.equal(lightBg);
    });

    it('should update --vaadin-text-color in dark subtree', () => {
      const lightEl = fixtureSync('<div></div>');
      const lightText = getColor(lightEl, '--vaadin-text-color');

      const container = fixtureSync(`
        <div theme="dark">
          <div id="inner"></div>
        </div>
      `);
      const inner = container.querySelector('#inner');
      const darkText = getColor(inner, '--vaadin-text-color');

      expect(darkText).to.not.equal(lightText);
    });
  });

  describe('backwards compatibility: light-only override', () => {
    let style;

    before(() => {
      // Simulate a user overriding only the light value
      style = document.createElement('style');
      style.textContent = `
        html {
          --lumo-base-color: pink;
        }
      `;
      document.head.appendChild(style);
    });

    after(() => {
      style.remove();
    });

    it('should use the overridden value in light mode', () => {
      const el = fixtureSync('<div style="background-color: var(--lumo-base-color)"></div>');
      // Pink in computed style
      expect(getColor(el, 'background-color')).to.not.equal(WHITE);
    });

    it('should use the dark fallback (not the light override) in dark mode', () => {
      document.documentElement.setAttribute('theme', 'dark');
      const el = fixtureSync('<div style="background-color: var(--lumo-base-color)"></div>');
      const bg = getColor(el, 'background-color');
      // Should NOT be pink — the dark fallback block should win
      expect(bg).to.not.equal('rgb(255, 192, 203)');
      // Should be the Lumo dark base color
      expect(bg).to.not.equal(WHITE);
    });
  });

  describe('backwards compatibility: light and dark override', () => {
    let style;

    before(() => {
      style = document.createElement('style');
      style.textContent = `
        html {
          --lumo-base-color: pink;
        }
        html[theme~='dark'] {
          --lumo-base-color: darkslategray;
        }
      `;
      document.head.appendChild(style);
    });

    after(() => {
      style.remove();
    });

    it('should use the light override in light mode', () => {
      const el = fixtureSync('<div style="background-color: var(--lumo-base-color)"></div>');
      expect(getColor(el, 'background-color')).to.equal('rgb(255, 192, 203)');
    });

    it('should use the dark override in dark mode', () => {
      document.documentElement.setAttribute('theme', 'dark');
      const el = fixtureSync('<div style="background-color: var(--lumo-base-color)"></div>');
      expect(getColor(el, 'background-color')).to.equal('rgb(47, 79, 79)');
    });
  });

  describe('light-dark mode', () => {
    it('should set color-scheme to light dark', () => {
      const el = fixtureSync('<div theme="light-dark"></div>');
      expect(getColor(el, 'color-scheme')).to.equal('light dark');
    });
  });
});
