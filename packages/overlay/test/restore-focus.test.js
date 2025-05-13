import { expect } from '@vaadin/chai-plugins';
import { escKeyDown, fixtureSync, mousedown, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-overlay.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

customElements.define(
  'overlay-field-wrapper',
  class extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });

      const overlay = document.createElement('vaadin-overlay');
      overlay.focusTrap = true;
      overlay.renderer = (root) => {
        if (!root.firstChild) {
          root.appendChild(document.createElement('input'));
        }
      };

      const input = document.createElement('input');

      this.shadowRoot.append(overlay, input);
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
    overlay = wrapper.shadowRoot.querySelector('vaadin-overlay');
    focusable = wrapper.shadowRoot.querySelector('input');
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
      await oneEvent(overlay, 'vaadin-overlay-open');
      overlay.opened = false;
      expect(getDeepActiveElement()).to.not.equal(focusInput);
    });

    describe('restoreFocusNode', () => {
      beforeEach(() => {
        overlay.restoreFocusNode = focusInput;
      });

      it('should not restore focus on close by default', async () => {
        focusInput.focus();
        overlay.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        overlay.opened = false;
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
        await oneEvent(overlay, 'vaadin-overlay-open');
        overlay.opened = false;
        expect(getDeepActiveElement()).to.equal(focusInput);
      });

      it('should restore focus on close in Shadow DOM', async () => {
        focusable.focus();
        overlay.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        overlay.opened = false;
        expect(getDeepActiveElement()).to.equal(focusable);
      });

      it('should not restore focus on close if focus was moved outside overlay', async () => {
        focusInput.focus();
        overlay.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        focusable.focus();
        overlay.opened = false;
        expect(getDeepActiveElement()).to.equal(focusable);
      });

      describe('restoreFocusNode', () => {
        beforeEach(() => {
          overlay.restoreFocusNode = focusInput;
        });

        it('should restore focus to the restoreFocusNode', async () => {
          focusable.focus();
          overlay.opened = true;
          await oneEvent(overlay, 'vaadin-overlay-open');
          overlay.opened = false;
          expect(getDeepActiveElement()).to.equal(focusInput);
        });
      });

      describe('prevent scroll', () => {
        it('should prevent scroll when restoring focus on close after mousedown', async () => {
          focusable.focus();
          overlay.opened = true;
          await oneEvent(overlay, 'vaadin-overlay-open');
          const spy = sinon.spy(focusable, 'focus');
          mousedown(document.body);
          overlay.opened = false;
          expect(spy).to.be.calledOnce;
          expect(spy.firstCall.args[0]).to.eql({ preventScroll: true });
        });

        it('should not prevent scroll when restoring focus on close after keydown', async () => {
          focusable.focus();
          overlay.opened = true;
          await oneEvent(overlay, 'vaadin-overlay-open');
          const spy = sinon.spy(focusable, 'focus');
          escKeyDown(document.body);
          overlay.opened = false;
          expect(spy).to.be.calledOnce;
          expect(spy.firstCall.args[0]).to.eql({ preventScroll: false });
        });
      });
    });
  });
});
