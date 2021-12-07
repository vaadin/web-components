import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '../src/controller-mixin.js';
import { FocusTrapController } from '../src/focus-trap-controller.js';

customElements.define(
  'focus-trap-element',
  class FocusTrapElement extends ControllerMixin(PolymerElement) {
    static get template() {
      return html`<slot></slot>`;
    }

    ready() {
      super.ready();
      this.innerHTML = `
        <div id="outside">
          <input id="outside-input-1" />

          <div id="trap">
            <input id="trap-input-1" />
            <input id="trap-input-2" />
            <input id="trap-input-3" />
          </div>

          <input id="outside-input-2" />
        </div>
      `;
    }
  }
);

describe('focus-trap-controller', () => {
  let element, controller, trap;

  describe('trapFocus', () => {
    beforeEach(() => {
      element = fixtureSync(`<focus-trap-element></focus-trap-element>`);
      controller = new FocusTrapController(element);
      element.addController(controller);
      trap = element.querySelector('#trap');
      element.querySelector('#outside-input-1').focus();
    });

    it('should set focus on the first focusable element in the default tab order', () => {
      controller.trapFocus(trap);
      const input = trap.querySelector('#trap-input-1');
      expect(document.activeElement).to.equal(input);
    });

    it('should set focus on the first focusable element in the custom tab order', () => {
      const input = trap.querySelector('#trap-input-2');
      input.tabIndex = 2;
      controller.trapFocus(trap);
      expect(document.activeElement).to.equal(input);
    });

    it('should set focus on the trap node when it is the first focusable element', () => {
      trap.tabIndex = 0;
      controller.trapFocus(trap);
      expect(document.activeElement).to.equal(trap);
    });

    it('should keep focus outside when no focusable elements are in the trap node', () => {
      trap.querySelectorAll('input').forEach((input) => {
        input.tabIndex = -1;
      });
      controller.trapFocus(trap);
      expect(trap.contains(document.activeElement)).to.be.false;
    });

    it('should keep focus on the element when the element is inside the trap node', () => {
      const input = element.querySelector('#trap-input-1');
      input.focus();
      controller.trapFocus(trap);
      expect(document.activeElement).to.equal(input);
    });
  });

  describe('releaseFocus', () => {
    beforeEach(() => {
      element = fixtureSync(`<focus-trap-element></focus-trap-element>`);
      controller = new FocusTrapController(element);
      element.addController(controller);
      trap = element.querySelector('#trap');
    });

    it('should not throw when no trap node', () => {
      expect(() => controller.releaseFocus(trap)).not.to.throw(Error);
    });
  });

  describe('keyboard navigation', () => {
    let trapInput1, trapInput2, trapInput3;

    async function tab() {
      await sendKeys({ press: 'Tab' });
      return document.activeElement;
    }

    async function shiftTab() {
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      return document.activeElement;
    }

    beforeEach(() => {
      element = fixtureSync(`<focus-trap-element></focus-trap-element>`);
      controller = new FocusTrapController(element);
      element.addController(controller);
      trap = element.querySelector('#trap');
      trapInput1 = trap.querySelector('#trap-input-1');
      trapInput2 = trap.querySelector('#trap-input-2');
      trapInput3 = trap.querySelector('#trap-input-3');
    });

    describe('trap is activated', () => {
      describe('default tab order', () => {
        beforeEach(() => {
          controller.trapFocus(trap);
        });

        it('should have focus on the 1st input', () => {
          expect(document.activeElement).to.equal(trapInput1);
        });

        it('should navigate cyclically within the trap node with Tab', async () => {
          const activeElement1 = await tab();
          const activeElement2 = await tab();
          const activeElement3 = await tab();
          expect([activeElement1.id, activeElement2.id, activeElement3.id]).to.deep.equal([
            'trap-input-2',
            'trap-input-3',
            'trap-input-1'
          ]);
        });

        it('should navigate cyclically within the trap node with Shift+Tab', async () => {
          const activeElement1 = await shiftTab();
          const activeElement2 = await shiftTab();
          const activeElement3 = await shiftTab();
          expect([activeElement1.id, activeElement2.id, activeElement3.id]).to.deep.equal([
            'trap-input-3',
            'trap-input-2',
            'trap-input-1'
          ]);
        });
      });

      describe('custom tab order', () => {
        beforeEach(() => {
          trapInput1.tabIndex = 2;
          trapInput2.tabIndex = 1;
          trapInput3.tabIndex = -1;
          controller.trapFocus(trap);
        });

        it('should have focus on the 2nd input', () => {
          expect(document.activeElement).to.equal(trapInput2);
        });

        it('should navigate cyclically within the trap node with Tab', async () => {
          const activeElement1 = await tab();
          const activeElement2 = await tab();
          const activeElement3 = await tab();
          expect([activeElement1.id, activeElement2.id, activeElement3.id]).to.deep.equal([
            'trap-input-1',
            'trap-input-2',
            'trap-input-1'
          ]);
        });

        it('should navigate cyclically within the trap node with Shift+Tab', async () => {
          const activeElement1 = await shiftTab();
          const activeElement2 = await shiftTab();
          const activeElement3 = await shiftTab();
          expect([activeElement1.id, activeElement2.id, activeElement3.id]).to.deep.equal([
            'trap-input-1',
            'trap-input-2',
            'trap-input-1'
          ]);
        });
      });
    });

    describe('trap is deactivated', () => {
      let outsideInput1, outsideInput2;

      beforeEach(() => {
        controller.trapFocus(trap);
        controller.releaseFocus(trap);

        outsideInput1 = element.querySelector('#outside-input-1');
        outsideInput2 = element.querySelector('#outside-input-2');
      });

      it('should have focus on the 1st input', () => {
        expect(document.activeElement).to.equal(trapInput1);
      });

      it('should move focus from the 1st input to outside the trap on Shift+Tab', async () => {
        await shiftTab();
        expect(document.activeElement).to.equal(outsideInput1);
      });

      it('should move focus from the 3rd input to outside the trap on Tab', async () => {
        trapInput3.focus();
        await tab();
        expect(document.activeElement).to.equal(outsideInput2);
      });
    });
  });
});
