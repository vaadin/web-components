import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '../src/controller-mixin.js';
import { OverflowController } from '../src/overflow-controller.js';

/**
 * Resolves once the function is invoked on the given object.
 */
function onceInvoked(object, functionName) {
  return new Promise((resolve) => {
    sinon.replace(object, functionName, (...args) => {
      sinon.restore();
      object[functionName](...args);
      resolve();
    });
  });
}

/**
 * Resolves once the ResizeObserver has processed a resize.
 */
async function onceResized(controller) {
  await onceInvoked(controller, '__updateOverflow');
}

customElements.define(
  'overflow-element',
  class OverflowElement extends ControllerMixin(PolymerElement) {
    static get template() {
      return html`
        <style>
          :host {
            display: flex;
            overflow: auto;
          }

          ::slotted(*) {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 40px;
            height: 40px;
            flex-shrink: 0;
          }
        </style>
        <slot></slot>
      `;
    }
  },
);

customElements.define(
  'overflow-wrapper-element',
  class OverflowWrapperElement extends ControllerMixin(PolymerElement) {
    static get template() {
      return html`
        <style>
          :host {
            display: block;
          }

          #scroller {
            overflow: auto;
            width: 100%;
            height: 100%;
          }

          ::slotted(*) {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 40px;
            height: 40px;
            flex-shrink: 0;
          }
        </style>
        <div id="scroller">
          <slot></slot>
        </div>
      `;
    }
  },
);

describe('overflow-controller', () => {
  describe('default', () => {
    let element, items, controller;

    describe('horizontal', () => {
      beforeEach(async () => {
        element = fixtureSync(`
          <overflow-element>
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
          </overflow-element>
        `);
        await nextFrame();
        items = Array.from(element.children);
        controller = new OverflowController(element);
        element.addController(controller);
      });

      ['LTR', 'RTL'].forEach((dir) => {
        describe(`horizontal ${dir}`, () => {
          before(() => {
            document.documentElement.setAttribute('dir', dir.toLowerCase());
          });

          after(() => {
            document.documentElement.removeAttribute('dir');
          });

          describe(`large viewport ${dir}`, () => {
            it(`should not have overflow when all items are visible with ${dir}`, () => {
              expect(element.hasAttribute('overflow')).to.be.false;
            });
          });

          describe(`small viewport ${dir}`, () => {
            beforeEach(async () => {
              element.style.width = '80px';
              await onceResized(controller);
              await nextFrame();
            });

            it(`should set overflow="end" if scroll is at the beginning with ${dir}`, () => {
              expect(element.getAttribute('overflow')).to.equal('end');
            });

            it(`should set overflow="start end" if scroll is at the middle with ${dir}`, async () => {
              items[2].scrollIntoView();
              await nextFrame();
              expect(element.getAttribute('overflow')).to.contain('start');
              expect(element.getAttribute('overflow')).to.contain('end');
            });

            it(`should set overflow="end" if scroll is at the end with ${dir}`, async () => {
              items[3].scrollIntoView();
              await nextFrame();
              expect(element.getAttribute('overflow')).to.equal('start');
            });

            it(`should update overflow attribute on host resize with ${dir}`, async () => {
              element.style.width = 'auto';
              await onceResized(controller);
              expect(element.hasAttribute('overflow')).to.be.false;
            });

            it(`should update overflow attribute on items resize with ${dir}`, async () => {
              items.forEach((item) => {
                item.style.minWidth = '20px';
              });
              await onceResized(controller);
              expect(element.hasAttribute('overflow')).to.be.false;
            });

            it(`should update overflow on items removal with ${dir}`, async () => {
              items[2].remove();
              items[3].remove();
              await nextFrame();
              expect(element.hasAttribute('overflow')).to.be.false;
            });
          });
        });
      });
    });

    describe('vertical', () => {
      beforeEach(async () => {
        element = fixtureSync(`
          <overflow-element style="display: block;">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
          </overflow-element>
        `);
        await nextFrame();
        items = Array.from(element.children);
        controller = new OverflowController(element);
        element.addController(controller);
      });

      describe('large viewport', () => {
        it('should not have vertical overflow when all items are visible', () => {
          expect(element.hasAttribute('overflow')).to.be.false;
        });
      });

      describe('small viewport', () => {
        beforeEach(async () => {
          element.style.height = '80px';
          await onceResized(controller);
          await nextFrame();
        });

        it('should set overflow="bottom" if vertical scroll is at the beginning', () => {
          expect(element.getAttribute('overflow')).to.equal('bottom');
        });

        it('should set overflow="top bottom" if vertical scroll is at the middle', async () => {
          items[1].scrollIntoView();
          await nextFrame();
          expect(element.getAttribute('overflow')).to.contain('top');
          expect(element.getAttribute('overflow')).to.contain('bottom');
        });

        it('should set overflow="top" if vertical scroll is at the end', async () => {
          items[3].scrollIntoView();
          await nextFrame();
          expect(element.getAttribute('overflow')).to.equal('top');
        });

        it('should update overflow attribute on host element resize', async () => {
          element.style.height = 'auto';
          await onceResized(controller);
          expect(element.hasAttribute('overflow')).to.be.false;
        });

        it('should update overflow attribute on items resize', async () => {
          items.forEach((item) => {
            item.style.height = '15px';
          });
          await onceResized(controller);
          expect(element.hasAttribute('overflow')).to.be.false;
        });

        it('should update overflow on items change', async () => {
          items[0].remove();
          items[1].remove();
          items[2].remove();
          await nextFrame();
          expect(element.hasAttribute('overflow')).to.be.false;
        });
      });
    });
  });

  describe('scroll target', () => {
    let element, scroller, items, controller;

    beforeEach(async () => {
      element = fixtureSync(`
        <overflow-wrapper-element>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
        </overflow-wrapper-element>
      `);
      await nextFrame();
      items = Array.from(element.children);
      scroller = element.$.scroller;
      controller = new OverflowController(element, scroller);
      element.addController(controller);
    });

    describe('horizontal scroller', () => {
      beforeEach(async () => {
        element.style.width = '80px';
        scroller.style.display = 'flex';
        await onceResized(controller);
        await nextFrame();
      });

      it('should update horizontal overflow when scroll target is used', async () => {
        items[3].scrollIntoView();
        await nextFrame();
        expect(element.getAttribute('overflow')).to.equal('start');
      });
    });

    describe('vertical scroller', () => {
      beforeEach(async () => {
        element.style.height = '80px';
        await onceResized(controller);
        await nextFrame();
      });

      it('should update vertical overflow when scroll target is used', async () => {
        items[3].scrollIntoView();
        await nextFrame();
        expect(element.getAttribute('overflow')).to.equal('top');
      });
    });
  });
});
