import { expect } from '@vaadin/chai-plugins';
import { aTimeout, defineLit, fixtureSync, nextFrame, nextResize } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { PolylitMixin } from '../src/polylit-mixin.js';
import { ResizeMixin } from '../src/resize-mixin.js';

describe('ResizeMixin', () => {
  let observeParent;

  const tag = defineLit(
    'resize-mixin',
    `
      <style>
        :host {
          display: block;
        }
      </style>
      <div></div>
    `,
    (Base) =>
      class extends ResizeMixin(PolylitMixin(Base)) {
        get _observeParent() {
          return observeParent;
        }
      },
  );

  let element;

  beforeEach(async () => {
    element = fixtureSync(`<${tag}></${tag}>`);
    // Wait for the initial resize.
    await nextResize(element);
  });

  it('should notify resize', async () => {
    const spy = sinon.spy(element, '_onResize');
    element.style.width = '100px';
    await nextResize(element);
    expect(spy.calledOnce).to.be.true;
  });

  it('should not notify resize for detached element', async () => {
    const spy = sinon.spy(element, '_onResize');
    element.remove();
    element.style.width = '100px';
    await aTimeout(100);
    expect(spy.called).to.be.false;
  });

  describe('observe parent', () => {
    let parent;

    beforeEach(() => {
      parent = fixtureSync('<div style="display: flex"></div>');
      observeParent = true;
    });

    describe('light DOM', () => {
      beforeEach(async () => {
        parent.appendChild(element);
        // Wait for the initial resize.
        await nextResize(parent);
      });

      it('should notify parent element resize', async () => {
        const spy = sinon.spy(element, '_onResize');
        parent.style.width = '100px';
        await nextResize(parent);
        expect(spy.calledOnce).to.be.true;
      });

      describe('multiple children', () => {
        let sibling, spy1, spy2;

        beforeEach(async () => {
          sibling = element.cloneNode(true);
          parent.appendChild(sibling);

          await nextFrame();
          await nextFrame();

          spy1 = sinon.spy(element, '_onResize');
          spy2 = sinon.spy(sibling, '_onResize');
        });

        it('should notify resize once per element', async () => {
          parent.style.width = '100px';
          await aTimeout(20);
          expect(spy1.calledOnce).to.be.true;
          expect(spy2.calledOnce).to.be.true;
        });

        it('should not notify element when detached', async () => {
          parent.removeChild(element);

          parent.style.width = '100px';
          await aTimeout(20);
          expect(spy1.called).to.be.false;
          expect(spy2.calledOnce).to.be.true;
        });
      });
    });

    describe('shadow DOM', () => {
      beforeEach(async () => {
        parent.attachShadow({ mode: 'open' });
        parent.shadowRoot.appendChild(element);
        // Wait for the initial resize.
        await nextResize(parent);
      });

      it('should notify shadow host resize', async () => {
        const spy = sinon.spy(element, '_onResize');
        parent.style.width = '100px';
        await nextResize(parent);
        expect(spy.calledOnce).to.be.true;
      });
    });
  });
});
