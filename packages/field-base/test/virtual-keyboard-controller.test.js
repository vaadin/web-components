import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { defineLit, definePolymer, fixtureSync, touchstart } from '@vaadin/testing-helpers';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { VirtualKeyboardController } from '../src/virtual-keyboard-controller.js';

const runTests = (defineHelper, baseMixin) => {
  const tag = defineHelper(
    'virtual-keyboard-controller',
    `<slot></slot>`,
    (Base) =>
      class extends baseMixin(Base) {
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

  let element, input;

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
};

describe('VirtualKeyboardController + Polymer', () => {
  runTests(definePolymer, ControllerMixin);
});

describe('VirtualKeyboardController + Lit', () => {
  runTests(defineLit, PolylitMixin);
});
