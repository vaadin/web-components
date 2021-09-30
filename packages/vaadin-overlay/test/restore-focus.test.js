import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@vaadin/text-field/vaadin-text-field.js';
import { open, close } from './helpers.js';
import '../src/vaadin-overlay.js';

customElements.define(
  'overlay-field-wrapper',
  class extends PolymerElement {
    static get template() {
      return html`
        <vaadin-overlay id="overlay">
          <template>
            <vaadin-text-field id="focusable"></vaadin-text-field>
          </template>
        </vaadin-overlay>
        <input id="focusable" />
      `;
    }
  }
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
    overlay._observer.flush();
    window.focus();
  });

  afterEach(() => {
    document.body.focus();
  });

  it('should not restore focus on close by default (restore-focus-on-close=false)', async () => {
    overlay.restoreFocusOnClose = false;
    focusInput.focus();
    await open(overlay);
    // emulate focus leaving the input
    focusInput.blur();
    document.body.focus();
    await close(overlay);
    expect(overlay._getActiveElement()).to.not.equal(focusInput);
  });

  it('should restore focus on close (restore-focus-on-close=true)', async () => {
    overlay.restoreFocusOnClose = true;
    focusInput.focus();
    await open(overlay);
    // emulate focus leaving the input
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
});
