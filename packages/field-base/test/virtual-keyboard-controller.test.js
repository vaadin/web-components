import { expect } from '@esm-bundle/chai';
import { fixtureSync, touchstart } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { VirtualKeyboardController } from '../src/virtual-keyboard-controller.js';

customElements.define(
  'virtual-keyboard-controller-element',
  class extends ControllerMixin(PolymerElement) {
    static get template() {
      return html`<input id="input" />`;
    }

    ready() {
      super.ready();
      this.addController(new VirtualKeyboardController(this, this.$.input));
    }

    open() {
      this.dispatchEvent(new CustomEvent('opened-changed', { detail: { value: true } }));
    }

    close() {
      this.dispatchEvent(new CustomEvent('opened-changed', { detail: { value: false } }));
    }
  }
);

describe('virtual-keyboard-controller-element', () => {
  let element, input;

  beforeEach(() => {
    element = fixtureSync('<virtual-keyboard-controller-element></virtual-keyboard-controller-element>');
    input = element.$.input;
  });

  it('should disable virtual keyboard on close', async () => {
    element.open();
    element.close();
    expect(input.inputMode).to.equal('none');
  });

  it('should re-enable virtual keyboard on touchstart', async () => {
    element.open();
    element.close();
    touchstart(element);
    expect(input.inputMode).to.equal('');
  });

  it('should re-enable virtual keyboard on blur', async () => {
    element.open();
    element.close();
    input.focus();
    await sendKeys({ press: 'Tab' });
    expect(input.inputMode).to.equal('');
  });
});
