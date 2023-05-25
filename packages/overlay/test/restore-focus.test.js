import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { close, open } from './helpers.js';

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

describe('restore focus', () => {
  let wrapper, overlay, focusable, focusInput;

  beforeEach(() => {
    focusInput = document.createElement('input');
    wrapper = fixtureSync('<overlay-field-wrapper></overlay-field-wrapper>');
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
      await open(overlay);
      await close(overlay);
      expect(getDeepActiveElement()).to.not.equal(focusInput);
    });

    describe('restoreFocusNode', () => {
      beforeEach(() => {
        overlay.restoreFocusNode = focusInput;
      });

      it('should not restore focus on close by default', async () => {
        focusInput.focus();
        await open(overlay);
        await close(overlay);
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
        await open(overlay);
        await close(overlay);
        expect(getDeepActiveElement()).to.equal(focusInput);
      });

      it('should restore focus on close in Shadow DOM', async () => {
        focusable.focus();
        await open(overlay);
        await close(overlay);
        expect(getDeepActiveElement()).to.equal(focusable);
      });

      it('should restore focus on close if focus was moved to body', async () => {
        focusInput.focus();
        await open(overlay);
        overlay.blur();
        await close(overlay);
        expect(getDeepActiveElement()).to.equal(focusInput);
      });

      it('should not restore focus on close if focus was moved outside overlay', async () => {
        focusInput.focus();
        await open(overlay);
        focusable.focus();
        await close(overlay);
        expect(getDeepActiveElement()).to.equal(focusable);
      });

      describe('restoreFocusNode', () => {
        beforeEach(() => {
          overlay.restoreFocusNode = focusInput;
        });

        it('should restore focus to the restoreFocusNode', async () => {
          focusable.focus();
          await open(overlay);
          await close(overlay);
          expect(getDeepActiveElement()).to.equal(focusInput);
        });
      });
    });
  });
});
