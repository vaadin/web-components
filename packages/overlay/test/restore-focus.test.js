import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

customElements.define(
  'overlay-field-wrapper',
  class extends PolymerElement {
    static get template() {
      return html`
        <vaadin-overlay id="overlay" renderer="[[renderer]]" focus-trap></vaadin-overlay>
        <input id="focusable" />
      `;
    }

    static get properties() {
      return {
        renderer: {
          type: Object,
          value: () => {
            return (root) => {
              if (!root.firstChild) {
                root.appendChild(document.createElement('input'));
              }
            };
          },
        },
      };
    }
  },
);

customElements.define(
  'focus-input-wrapper',
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `<slot></slot>`;
    }
  },
);

describe('restore focus', () => {
  let wrapper, overlay, focusable, focusInput;

  beforeEach(async () => {
    focusInput = document.createElement('input');
    wrapper = fixtureSync('<overlay-field-wrapper></overlay-field-wrapper>');
    await nextRender();
    overlay = wrapper.$.overlay;
    focusable = wrapper.$.focusable;
  });

  describe('default', () => {
    beforeEach(() => {
      document.body.appendChild(focusInput);
    });

    afterEach(() => {
      document.body.removeChild(focusInput);
    });

    it('should not restore focus on close by default', async () => {
      focusInput.focus();
      overlay.opened = true;
      await nextRender();
      overlay.opened = false;
      await nextRender();
      expect(getDeepActiveElement()).to.not.equal(focusInput);
    });

    describe('restoreFocusNode', () => {
      beforeEach(() => {
        overlay.restoreFocusNode = focusInput;
      });

      it('should not restore focus on close by default', async () => {
        focusInput.focus();
        overlay.opened = true;
        await nextRender();
        overlay.opened = false;
        await nextRender();
        expect(getDeepActiveElement()).to.not.equal(focusInput);
      });
    });
  });

  describe('restoreFocusOnClose', () => {
    beforeEach(() => {
      overlay.restoreFocusOnClose = true;
    });

    describe('basic', () => {
      beforeEach(() => {
        document.body.appendChild(focusInput);
      });

      afterEach(() => {
        document.body.removeChild(focusInput);
      });

      it('should restore focus on close', async () => {
        focusInput.focus();
        overlay.opened = true;
        await nextRender();
        overlay.opened = false;
        await nextRender();
        expect(getDeepActiveElement()).to.equal(focusInput);
      });

      it('should restore focus on close in Shadow DOM', async () => {
        focusable.focus();
        overlay.opened = true;
        await nextRender();
        overlay.opened = false;
        await nextRender();
        expect(getDeepActiveElement()).to.equal(focusable);
      });

      it('should not restore focus on close if focus was moved outside overlay', async () => {
        focusInput.focus();
        overlay.opened = true;
        await nextRender();
        focusable.focus();
        overlay.opened = false;
        await nextRender();
        expect(getDeepActiveElement()).to.equal(focusable);
      });

      describe('restoreFocusNode', () => {
        beforeEach(() => {
          overlay.restoreFocusNode = focusInput;
        });

        it('should restore focus to the restoreFocusNode', async () => {
          focusable.focus();
          overlay.opened = true;
          await nextRender();
          overlay.opened = false;
          await nextRender();
          expect(getDeepActiveElement()).to.equal(focusInput);
        });
      });
    });
  });
});
