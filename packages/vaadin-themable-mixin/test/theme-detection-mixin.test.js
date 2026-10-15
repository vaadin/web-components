import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import { LitElement } from 'lit';
import { ThemeDetectionMixin } from '../vaadin-theme-detection-mixin.js';

class TestElement extends ThemeDetectionMixin(LitElement) {
  static get is() {
    return 'test-element';
  }

  static get version() {
    return '1.0.0';
  }
}

customElements.define(TestElement.is, TestElement);

class CustomStyleRoot extends LitElement {}

customElements.define('custom-style-root', CustomStyleRoot);

describe('theme-detection-mixin', () => {
  let styleRoot, hostElement, contentElement, stylesheet, testElement;

  function applyTheme(themeProperty = null) {
    if (styleRoot.adoptedStyleSheets.includes(stylesheet)) {
      styleRoot.adoptedStyleSheets = styleRoot.adoptedStyleSheets.filter((s) => s !== stylesheet);
    }

    if (themeProperty) {
      stylesheet = new CSSStyleSheet();
      stylesheet.replaceSync(`:host, :root { ${themeProperty}: 1; }`);
      styleRoot.adoptedStyleSheets = [...styleRoot.adoptedStyleSheets, stylesheet];
    }
  }

  beforeEach(() => {
    testElement = document.createElement('test-element');
  });

  afterEach(() => {
    testElement.remove();
    styleRoot.__themeDetector?.disconnect();
    styleRoot.__themeDetector = undefined;
    styleRoot.__cssPropertyObserver?.disconnect();
    styleRoot.__cssPropertyObserver = undefined;
    applyTheme();
  });

  function runThemeDetectionTests() {
    it('should define ThemeDetector on the style root', () => {
      contentElement.append(testElement);

      expect(styleRoot.__themeDetector).to.be.ok;
    });

    describe('initial theme', () => {
      it('should detect no theme', () => {
        contentElement.append(testElement);

        expect(testElement.hasAttribute('data-application-theme')).to.be.false;
      });

      it('should detect Aura theme', () => {
        applyTheme('--vaadin-aura-theme');

        contentElement.append(testElement);

        expect(testElement.getAttribute('data-application-theme')).to.equal('aura');
      });

      it('should detect Lumo theme', () => {
        applyTheme('--vaadin-lumo-theme');

        contentElement.append(testElement);

        expect(testElement.getAttribute('data-application-theme')).to.equal('lumo');
      });
    });

    describe('theme changes', () => {
      beforeEach(async () => {
        contentElement.append(testElement);
        await nextRender();
      });

      it('should detect theme changes', async () => {
        expect(testElement.hasAttribute('data-application-theme')).to.be.false;

        applyTheme('--vaadin-aura-theme');
        await oneEvent(hostElement, 'transitionend');
        expect(testElement.getAttribute('data-application-theme')).to.equal('aura');

        applyTheme('--vaadin-lumo-theme');
        await oneEvent(hostElement, 'transitionend');
        expect(testElement.getAttribute('data-application-theme')).to.equal('lumo');

        applyTheme();
        await oneEvent(hostElement, 'transitionend');
        expect(testElement.hasAttribute('data-application-theme')).to.be.false;
      });
    });
  }

  describe('in global scope', () => {
    beforeEach(() => {
      hostElement = document;
      styleRoot = document;
      contentElement = document.body;
    });

    runThemeDetectionTests();
  });

  describe('in shadow root', () => {
    beforeEach(() => {
      hostElement = fixtureSync(`<custom-style-root></custom-style-root>`);
      styleRoot = hostElement.shadowRoot;
      contentElement = hostElement.shadowRoot;
    });

    runThemeDetectionTests();
  });
});
