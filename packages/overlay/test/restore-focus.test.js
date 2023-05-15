import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { close, open } from './helpers.js';

customElements.define(
  'overlay-field-wrapper',
  class extends PolymerElement {
    static get template() {
      return html`
        <vaadin-overlay id="overlay" renderer="[[renderer]]"></vaadin-overlay>
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

  describe('basic', () => {
    beforeEach(() => {
      document.body.appendChild(focusInput);
    });

    afterEach(() => {
      document.body.removeChild(focusInput);
    });

    it('should not restore focus on close by default', async () => {
      focusInput.focus();
      await open(overlay);
      // Emulate focus leaving the input
      focusInput.blur();
      document.body.focus();
      await close(overlay);
      expect(overlay._getActiveElement()).to.not.equal(focusInput);
    });

    describe('restoreFocusOnClose', () => {
      beforeEach(() => {
        overlay.restoreFocusOnClose = true;
      });

      it('should restore focus on close', async () => {
        focusInput.focus();
        await open(overlay);
        // Emulate focus leaving the input
        focusInput.blur();
        document.body.focus();
        await close(overlay);
        expect(overlay._getActiveElement()).to.equal(focusInput);
      });

      it('should restore focus on close in Shadow DOM', async () => {
        focusable.focus();
        await open(overlay);
        await close(overlay);
        expect(overlay._getActiveElement()).to.equal(focusable);
      });

      it('should not restore focus on close if focus was moved outside overlay', async () => {
        focusInput.focus();
        await open(overlay);
        focusable.focus();
        await close(overlay);
        expect(overlay._getActiveElement()).to.equal(focusable);
      });
    });

    describe('restoreFocusNode', () => {
      beforeEach(() => {
        overlay.restoreFocusNode = focusInput;
      });

      it('should not restore focus on close by default', async () => {
        focusInput.focus();
        await open(overlay);
        // Emulate focus leaving the input
        focusInput.blur();
        document.body.focus();
        await close(overlay);
        expect(overlay._getActiveElement()).to.not.equal(focusInput);
      });

      describe('restoreFocusOnClose', () => {
        beforeEach(() => {
          overlay.restoreFocusOnClose = true;
        });

        it('should restore focus to the restoreFocusNode', async () => {
          focusable.focus();
          await open(overlay);
          focusable.blur();
          await close(overlay);
          expect(overlay._getActiveElement()).to.equal(focusInput);
        });
      });
    });
  });
});
