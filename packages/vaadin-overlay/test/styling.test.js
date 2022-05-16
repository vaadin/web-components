import { expect } from '@esm-bundle/chai';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import '../vaadin-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'overlay-local-styles',
  css`
    .themed-styles-content {
      font-family: '.themed-styles-content';
    }
  `,
);

customElements.define(
  'overlay-local-styles',
  class extends ThemableMixin(PolymerElement) {
    static get is() {
      return 'overlay-local-styles';
    }

    static get template() {
      return html`
        <style>
          :host {
            font-family: ':host';
          }

          .local-styles-content {
            font-family: '.local-styles-content';
          }

          [part='overlay'] {
            font-family: '[part="overlay"]';
          }
        </style>

        <vaadin-overlay id="overlay" opened="{{opened}}">
          <template>
            <div class="local-styles-content"></div>
            <div class="global-styles-content"></div>
            <div class="themed-styles-content"></div>
          </template>
        </vaadin-overlay>
      `;
    }

    static get properties() {
      return {
        opened: Boolean,
      };
    }
  },
);

function getComputedStyleSource(element) {
  return getComputedStyle(element)
    .getPropertyValue('font-family')
    .trim()
    .replace(/^([''"])(.*)\1/, '$2');
}

describe('overlay content styling', () => {
  let overlay, globalStyle;

  before(() => {
    globalStyle = document.createElement('style');
    globalStyle.innerHTML = `
      .global-styles-content {
        font-family: ".global-styles-content";
      }
    `;
    document.head.appendChild(globalStyle);
  });

  describe('local styles', () => {
    beforeEach(async () => {
      const localStyles = fixtureSync('<overlay-local-styles></overlay-local-styles>');
      overlay = localStyles.$.overlay;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should stamp content into a shadowRoot', () => {
      expect(overlay.content).to.be.instanceof(ShadowRoot);
    });

    it('should not slot the content', () => {
      expect(overlay.content.children[0].assignedSlot).to.be.null;
      expect(overlay.content.children[1].assignedSlot).to.be.null;
    });

    it('should apply local styles to overlay content', () => {
      const localNode = overlay.content.querySelector('.local-styles-content');
      expect(getComputedStyleSource(localNode)).to.equal('.local-styles-content');
    });

    it('should apply styles from themable mixin to overlay content', () => {
      const themedNode = overlay.content.querySelector('.themed-styles-content');
      expect(getComputedStyleSource(themedNode)).to.equal('.themed-styles-content');
    });

    it('should not apply global styles to overlay content', () => {
      const globalNode = overlay.content.querySelector('.global-styles-content');
      expect(getComputedStyleSource(globalNode)).to.not.equal('.global-styles-content');
    });

    it('should not apply host styles to overlay content', () => {
      expect(getComputedStyleSource(overlay.content.host)).to.not.equal(':host');
    });

    it('should not apply local part styles to overlay', () => {
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      expect(getComputedStyleSource(overlayPart)).to.not.equal('[part="overlay"]');
    });
  });

  describe('global styles', () => {
    beforeEach(async () => {
      overlay = fixtureSync(`
        <vaadin-overlay id="overlay">
          <template>
            <div class="local-styles-content"></div>
            <div class="global-styles-content"></div>
          </template>
        </vaadin-overlay>
      `);
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should stamp content into overlay host', () => {
      expect(overlay.content).to.equal(overlay);
    });

    it('should slot content into content part', () => {
      const slot = overlay.$.content.firstElementChild;
      expect(overlay.content.children[0].assignedSlot).to.equal(slot);
      expect(overlay.content.children[1].assignedSlot).to.equal(slot);
    });

    it('should apply global styles to overlay content', () => {
      const globalNode = overlay.content.querySelector('.global-styles-content');
      expect(getComputedStyleSource(globalNode)).to.equal('.global-styles-content');
    });

    it('should not apply local styles to overlay content', () => {
      const localNode = overlay.content.querySelector('.local-styles-content');
      expect(getComputedStyleSource(localNode)).to.not.equal('.local-styles-content');
    });
  });
});
