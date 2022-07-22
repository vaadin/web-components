import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '../src/controller-mixin.js';
import { FocusTrapController } from '../src/focus-trap-controller.js';

customElements.define(
  'focus-trap-wrapper',
  class FocusTrapWrapper extends ControllerMixin(PolymerElement) {
    static get template() {
      return html`<slot></slot>`;
    }

    ready() {
      super.ready();
      this.innerHTML = `
        <div id="outer-trap">
          <focus-trap-element></focus-trap-element>
        </div>
      `;
    }
  },
);

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
            <div id="parent">
              <textarea id="trap-input-3"></textarea>
            </div>
          </div>

          <input id="outside-input-2" />
        </div>
      `;
    }
  },
);

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

    it('should keep focus on the element when it is inside the trap node', () => {
      const input = element.querySelector('#trap-input-1');
      input.focus();
      controller.trapFocus(trap);
      expect(document.activeElement).to.equal(input);
    });

    describe('no focusable elements', () => {
      beforeEach(() => {
        trap.querySelectorAll('input, textarea').forEach((input) => {
          input.tabIndex = -1;
        });
      });

      it('should throw an exception', () => {
        expect(() => controller.trapFocus(trap)).to.throw(Error);
      });

      it('should keep focus outside the trap node', () => {
        expect(() => controller.trapFocus(trap)).to.throw(Error);

        const input = element.querySelector('#outside-input-1');
        expect(document.activeElement).to.equal(input);
      });

      it('should not set a trap', async () => {
        expect(() => controller.trapFocus(trap)).to.throw(Error);

        await tab();
        const input = element.querySelector('#outside-input-2');
        expect(document.activeElement).to.equal(input);
      });
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
            'trap-input-1',
          ]);
        });

        it('should navigate cyclically within the trap node with Shift+Tab', async () => {
          const activeElement1 = await shiftTab();
          const activeElement2 = await shiftTab();
          const activeElement3 = await shiftTab();
          expect([activeElement1.id, activeElement2.id, activeElement3.id]).to.deep.equal([
            'trap-input-3',
            'trap-input-2',
            'trap-input-1',
          ]);
        });

        it('should select the input element when focusing it with Tab', async () => {
          const spy = sinon.spy(trapInput2, 'select');
          await tab();
          expect(spy.called).to.be.true;
        });

        it('should not select non-input element when focusing it with Tab', async () => {
          const spy = sinon.spy(trapInput3, 'select');
          await tab();
          await tab();
          expect(spy.called).to.be.false;
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
            'trap-input-1',
          ]);
        });

        it('should navigate cyclically within the trap node with Shift+Tab', async () => {
          const activeElement1 = await shiftTab();
          const activeElement2 = await shiftTab();
          const activeElement3 = await shiftTab();
          expect([activeElement1.id, activeElement2.id, activeElement3.id]).to.deep.equal([
            'trap-input-1',
            'trap-input-2',
            'trap-input-1',
          ]);
        });
      });

      describe('hidden elements', () => {
        beforeEach(() => {
          controller.trapFocus(trap);
        });

        it('should exclude elements hidden with display: none', async () => {
          trapInput3.style.display = 'none';

          const activeElement1 = await tab();
          const activeElement2 = await tab();
          const activeElement3 = await tab();
          expect([activeElement1.id, activeElement2.id, activeElement3.id]).to.deep.equal([
            'trap-input-2',
            'trap-input-1',
            'trap-input-2',
          ]);
        });

        it('should exclude elements hidden with visibility: hidden', async () => {
          trapInput3.style.visibility = 'hidden';

          const activeElement1 = await tab();
          const activeElement2 = await tab();
          const activeElement3 = await tab();
          expect([activeElement1.id, activeElement2.id, activeElement3.id]).to.deep.equal([
            'trap-input-2',
            'trap-input-1',
            'trap-input-2',
          ]);
        });

        it('should exclude elements whose parent node is not visible', async () => {
          trapInput3.parentNode.style.display = 'none';

          const activeElement1 = await tab();
          const activeElement2 = await tab();
          const activeElement3 = await tab();
          expect([activeElement1.id, activeElement2.id, activeElement3.id]).to.deep.equal([
            'trap-input-2',
            'trap-input-1',
            'trap-input-2',
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

  describe('nested', () => {
    let wrapper, wrapperController, wrapperTrap, trapInput1, trapInput2, trapInput3;

    beforeEach(() => {
      wrapper = fixtureSync(`<focus-trap-wrapper></focus-trap-wrapper>`);
      wrapperController = new FocusTrapController(element);
      wrapper.addController(wrapperController);
      wrapperTrap = wrapper.querySelector('#outer-trap');

      element = wrapper.querySelector('focus-trap-element');
      controller = new FocusTrapController(element);
      element.addController(controller);
      trap = element.querySelector('#trap');

      trapInput1 = trap.querySelector('#trap-input-1');
      trapInput2 = trap.querySelector('#trap-input-2');
      trapInput3 = trap.querySelector('#trap-input-3');
    });

    it('should only take last active controller instance into account', async () => {
      wrapperController.trapFocus(wrapperTrap);
      controller.trapFocus(trap);

      trapInput1.focus();
      await tab();

      expect(document.activeElement).to.equal(trapInput2);
    });

    it('should use outer trap when nested controller is de-activated', async () => {
      wrapperController.trapFocus(wrapperTrap);
      controller.trapFocus(trap);

      trapInput1.focus();
      await shiftTab();

      expect(document.activeElement).to.equal(trapInput3);

      controller.releaseFocus();

      await tab();
      await tab();
      await tab();

      expect(document.activeElement).to.equal(trapInput1);
    });
  });
});
