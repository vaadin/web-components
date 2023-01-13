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

  before(() => {
    focusInput = document.createElement('input');
    document.body.appendChild(focusInput);
  });

  after(() => {
    document.body.removeChild(focusInput);
  });

  beforeEach(() => {
    wrapper = fixtureSync('<overlay-field-wrapper></overlay-field-wrapper>');
    overlay = wrapper.$.overlay;
    focusable = wrapper.$.focusable;
  });

  afterEach(() => {
    document.body.focus();
  });

  it('should not restore focus on close by default (restore-focus-on-close=false)', async () => {
    overlay.restoreFocusOnClose = false;
    focusInput.focus();
    await open(overlay);
    // Emulate focus leaving the input
    focusInput.blur();
    document.body.focus();
    await close(overlay);
    expect(overlay._getActiveElement()).to.not.equal(focusInput);
  });

  it('should restore focus on close (restore-focus-on-close=true)', async () => {
    overlay.restoreFocusOnClose = true;
    focusInput.focus();
    await open(overlay);
    // Emulate focus leaving the input
    focusInput.blur();
    document.body.focus();
    await close(overlay);
    expect(overlay._getActiveElement()).to.equal(focusInput);
  });

  it('should restore focus on close in Shadow DOM (restore-focus-on-close=true)', async () => {
    overlay.restoreFocusOnClose = true;
    focusable.focus();
    await open(overlay);
    await close(overlay);
    expect(overlay._getActiveElement()).to.equal(focusable);
  });

  it('should not restore focus on close if focus was changed', async () => {
    overlay.restoreFocusOnClose = true;
    focusInput.focus();
    await open(overlay);
    focusable.focus();
    await close(overlay);
    expect(overlay._getActiveElement()).to.equal(focusable);
  });

  describe('restoreFocusNode', () => {
    beforeEach(() => {
      overlay.restoreFocusNode = focusInput;
    });

    it('should not restore focus on close by default (restore-focus-on-close=false)', async () => {
      overlay.restoreFocusOnClose = false;
      focusInput.focus();
      await open(overlay);
      // Emulate focus leaving the input
      focusInput.blur();
      document.body.focus();
      await close(overlay);
      expect(overlay._getActiveElement()).to.not.equal(focusInput);
    });

    it('should restore focus to the restoreFocusNode', async () => {
      overlay.restoreFocusOnClose = true;
      focusable.focus();
      await open(overlay);
      focusable.blur();
      await close(overlay);
      expect(overlay._getActiveElement()).to.equal(focusInput);
    });
  });
});
