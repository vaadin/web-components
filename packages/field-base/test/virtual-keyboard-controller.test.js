import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { defineLit, fixtureSync, touchstart } from '@vaadin/testing-helpers';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { VirtualKeyboardController } from '../src/virtual-keyboard-controller.js';

describe('VirtualKeyboardController', () => {
  const defineHost = (name, keepWhenFocused) =>
    defineLit(
      name,
      `<slot></slot>`,
      (Base) =>
        class extends PolylitMixin(Base) {
          constructor() {
            super();
            this.inputElement = document.createElement('input');
            this.appendChild(this.inputElement);
          }

          ready() {
            super.ready();
            this.addController(new VirtualKeyboardController(this, keepWhenFocused));
          }

          open() {
            this.dispatchEvent(new CustomEvent('opened-changed', { detail: { value: true } }));
          }

          close() {
            this.dispatchEvent(new CustomEvent('opened-changed', { detail: { value: false } }));
          }
        },
    );

  let element, input;

  describe('default', () => {
    const tag = defineHost('virtual-keyboard-controller');

    beforeEach(() => {
      element = fixtureSync(`
        <div>
          <${tag}></${tag}>
          <input id="last-global-focusable" />
        </div>
      `).firstElementChild;
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

    it('should disable virtual keyboard on close when input is focused', () => {
      input.focus();
      element.open();
      element.close();
      expect(input.inputMode).to.equal('none');
    });
  });

  describe('keepWhenFocused', () => {
    const keepTag = defineHost('virtual-keyboard-controller-keep', true);

    beforeEach(() => {
      element = fixtureSync(`<${keepTag}></${keepTag}>`);
      input = element.inputElement;
    });

    it('should not disable virtual keyboard on close when input is focused', () => {
      input.focus();
      element.open();
      element.close();
      expect(input.inputMode).to.equal('');
    });

    it('should disable virtual keyboard on close when input is not focused', () => {
      element.open();
      element.close();
      expect(input.inputMode).to.equal('none');
    });

    it('should disable virtual keyboard on close after input has lost focus', () => {
      input.focus();
      element.open();
      input.blur();
      element.close();
      expect(input.inputMode).to.equal('none');
    });
  });
});
