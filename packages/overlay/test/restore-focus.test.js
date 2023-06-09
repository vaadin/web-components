import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
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
      overlay.opened = true;
      await nextRender();
      overlay.opened = false;
      expect(getDeepActiveElement()).to.not.equal(focusInput);
    });

    it('should not restore focus-ring attribute on close by default', async () => {
      focusInput.focus();
      focusInput.setAttribute('focus-ring', '');
      overlay.opened = true;
      await nextRender();
      focusInput.removeAttribute('focus-ring');
      overlay.opened = false;
      expect(focusInput.hasAttribute('focus-ring')).to.be.false;
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
        expect(getDeepActiveElement()).to.not.equal(focusInput);
      });

      it('should not restore focus-ring attribute on close by default', async () => {
        focusInput.focus();
        focusInput.setAttribute('focus-ring', '');
        overlay.opened = true;
        await nextRender();
        focusInput.removeAttribute('focus-ring');
        overlay.opened = false;
        expect(focusInput.hasAttribute('focus-ring')).to.be.false;
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
        expect(getDeepActiveElement()).to.equal(focusInput);
      });

      it('should restore focus-ring attribute on close', async () => {
        focusInput.focus();
        focusInput.setAttribute('focus-ring', '');
        overlay.opened = true;
        await nextRender();
        focusInput.removeAttribute('focus-ring');
        overlay.opened = false;
        expect(focusInput.hasAttribute('focus-ring')).to.be.true;
      });

      it('should not restore focus-ring attribute on close if it was not present', async () => {
        focusInput.focus();
        overlay.opened = true;
        await nextRender();
        overlay.opened = false;
        expect(focusInput.hasAttribute('focus-ring')).to.be.false;
      });

      it('should restore focus on close in Shadow DOM', async () => {
        focusable.focus();
        overlay.opened = true;
        await nextRender();
        overlay.opened = false;
        expect(getDeepActiveElement()).to.equal(focusable);
      });

      it('should restore focus asynchronously on outside click', async () => {
        focusInput.focus();
        overlay.opened = true;
        await nextRender();
        outsideClick();
        await aTimeout(0);
        expect(getDeepActiveElement()).to.equal(focusInput);
      });

      it('should restore focus-ring attribute on outside click', async () => {
        focusInput.focus();
        focusInput.setAttribute('focus-ring', '');
        overlay.opened = true;
        await nextRender();
        focusInput.removeAttribute('focus-ring');
        outsideClick();
        expect(focusInput.hasAttribute('focus-ring')).to.be.true;
      });

      it('should not restore focus on close if focus was moved outside overlay', async () => {
        focusInput.focus();
        overlay.opened = true;
        await nextRender();
        focusable.focus();
        overlay.opened = false;
        expect(getDeepActiveElement()).to.equal(focusable);
      });

      it('should not restore focus-ring attribute if focus was moved outside overlay', async () => {
        focusInput.focus();
        focusInput.setAttribute('focus-ring', '');
        overlay.opened = true;
        await nextRender();
        focusInput.removeAttribute('focus-ring');
        focusable.focus();
        overlay.opened = false;
        expect(focusInput.hasAttribute('focus-ring')).to.be.false;
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
          expect(getDeepActiveElement()).to.equal(focusInput);
        });

        it('should restore focus-ring attribute on the restoreFocusNode', async () => {
          focusable.focus();
          focusInput.setAttribute('focus-ring', '');
          overlay.opened = true;
          await nextRender();
          focusInput.removeAttribute('focus-ring');
          overlay.opened = false;
          expect(focusInput.hasAttribute('focus-ring')).to.be.true;
        });
      });
    });

    describe('focus node inside a slot', () => {
      let focusInputWrapper;

      beforeEach(() => {
        focusInputWrapper = fixtureSync('<focus-input-wrapper></focus-input-wrapper>');
        focusInputWrapper.appendChild(focusInput);
      });

      it('should restore focus-ring attribute on the host component', async () => {
        focusInput.focus();
        focusInputWrapper.setAttribute('focus-ring', '');
        overlay.opened = true;
        await nextRender();
        focusInputWrapper.removeAttribute('focus-ring');
        overlay.opened = false;
        expect(focusInputWrapper.hasAttribute('focus-ring')).to.be.true;
      });
    });

    describe('focus node inside Shadow DOM', () => {
      let focusInputWrapper;

      beforeEach(() => {
        focusInputWrapper = fixtureSync('<focus-input-wrapper></focus-input-wrapper>');
        focusInputWrapper.shadowRoot.appendChild(focusInput);
      });

      it('should restore focus-ring attribute on the host component', async () => {
        focusInput.focus();
        focusInputWrapper.setAttribute('focus-ring', '');
        overlay.opened = true;
        await nextRender();
        focusInputWrapper.removeAttribute('focus-ring');
        overlay.opened = false;
        expect(focusInputWrapper.hasAttribute('focus-ring')).to.be.true;
      });
    });
  });
});
