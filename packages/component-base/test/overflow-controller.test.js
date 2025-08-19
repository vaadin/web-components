import { expect } from '@vaadin/chai-plugins';
import { definePolymer, fixtureSync, nextFrame, nextRender, nextResize } from '@vaadin/testing-helpers';
import { ControllerMixin } from '../src/controller-mixin.js';
import { OverflowController } from '../src/overflow-controller.js';

describe('OverflowController', () => {
  const tag = definePolymer(
    'overflow',
    `
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
    `,
    (Base) => class extends ControllerMixin(Base) {},
  );

  const wrapperTag = definePolymer(
    'overflow-wrapper',
    `
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
    `,
    (Base) => class extends ControllerMixin(Base) {},
  );

  describe('default', () => {
    let element, items, controller;

    describe('horizontal', () => {
      beforeEach(async () => {
        element = fixtureSync(`
          <${tag}>
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
          </${tag}>
        `);
        // Wait for initial update
        await nextRender();
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
              await nextResize(element);
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
              await nextResize(element);
              await nextFrame();
              expect(element.hasAttribute('overflow')).to.be.false;
            });

            it(`should update overflow attribute on items resize with ${dir}`, async () => {
              items.forEach((item) => {
                item.style.minWidth = '20px';
              });
              await Promise.all(items.map((item) => nextResize(item)));
              await nextFrame();
              expect(element.hasAttribute('overflow')).to.be.false;
            });

            it(`should update overflow on items removal with ${dir}`, async () => {
              items[2].remove();
              items[3].remove();
              await nextFrame();
              expect(element.hasAttribute('overflow')).to.be.false;
            });

            it(`should update overflow on items adding with ${dir}`, async () => {
              items[2].remove();
              items[3].remove();
              await nextFrame();

              const div = document.createElement('div');
              div.textContent = '5';
              element.appendChild(div);
              await nextFrame();

              div.style.minWidth = '30px';
              await nextResize(div);
              await nextFrame();
              expect(element.hasAttribute('overflow')).to.be.true;
            });
          });
        });
      });
    });

    describe('vertical', () => {
      beforeEach(async () => {
        element = fixtureSync(`
          <${tag} style="display: block;">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
          </${tag}>
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
          await nextResize(element);
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
          await nextResize(element);
          await nextFrame();
          expect(element.hasAttribute('overflow')).to.be.false;
        });

        it('should update overflow attribute on items resize', async () => {
          items.forEach((item) => {
            item.style.height = '15px';
          });
          await Promise.all(items.map((item) => nextResize(item)));
          await nextFrame();
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
        <${wrapperTag}>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
        </${wrapperTag}>
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
        await nextResize(element);
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
        await nextResize(element);
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
