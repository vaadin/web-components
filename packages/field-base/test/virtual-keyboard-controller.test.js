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
      return html`<slot></slot>`;
    }

    constructor() {
      super();
      this.inputElement = document.createElement('input');
      this.appendChild(this.inputElement);
    }

    ready() {
      super.ready();
      this.addController(new VirtualKeyboardController(this));
    }

    open() {
      this.dispatchEvent(new CustomEvent('opened-changed', { detail: { value: true } }));
    }

    close() {
      this.dispatchEvent(new CustomEvent('opened-changed', { detail: { value: false } }));
    }
  },
);

describe('virtual-keyboard-controller', () => {
  let element, input;

  beforeEach(() => {
    element = fixtureSync('<virtual-keyboard-controller-element></virtual-keyboard-controller-element>');
    input = element.inputElement;
  });

  it('should disable virtual keyboard on close', () => {
    element.open();
    element.close();
    expect(input.inputMode).to.equal('none');
  });

  it('should re-enable virtual keyboard on touchstart', () => {
    element.open();
    element.close();
    touchstart(element);
    expect(input.inputMode).to.equal('');
  });

  it('should re-enable virtual keyboard on blur', async () => {
    element.open();
    element.close();
    element.tabIndex = 1;
    element.focus();
    await sendKeys({ press: 'Tab' });
    expect(input.inputMode).to.equal('');
  });
});
