import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ResizeMixin } from '../src/resize-mixin.js';

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
 * Resolves once the ResizeObserver in AvatarGroup has processed a resize.
 */
async function onceResized(el) {
  // Wait for the _onResize function to be invoked by the ResizeObserver
  await onceInvoked(el, '_onResize');
}

describe('resize-mixin', () => {
  let element, observeParent;

  before(() => {
    customElements.define(
      'resize-mixin-element',
      class extends ResizeMixin(PolymerElement) {
        static get template() {
          return html`
            <style>
              :host {
                display: block;
              }
            </style>
            <div></div>
          `;
        }

        get _observeParent() {
          return observeParent;
        }
      },
    );
  });

  beforeEach(async () => {
    element = fixtureSync(`<resize-mixin-element></resize-mixin-element>`);
    // Wait for the initial resize.
    await onceResized(element);
  });

  it('should notify resize', async () => {
    const spy = sinon.spy(element, '_onResize');
    element.style.width = '100px';
    await onceResized(element);
    expect(spy.calledOnce).to.be.true;
  });

  it('should not notify resize for detached element', async () => {
    const spy = sinon.spy(element, '_onResize');
    element.remove();
    element.style.width = '100px';
    await aTimeout(100);
    expect(spy.called).to.be.false;
  });

  describe('console warnings', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');
    });

    afterEach(() => {
      console.warn.restore();
    });

    it('should warn when calling deprecated notifyResize()', () => {
      element.notifyResize();
      expect(console.warn.calledOnce).to.be.true;
      expect(console.warn.args[0][0]).to.include('WARNING: Since Vaadin 23, notifyResize() is deprecated.');
    });
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
        await onceResized(element);
      });

      it('should notify parent element resize', async () => {
        const spy = sinon.spy(element, '_onResize');
        parent.style.width = '100px';
        await onceResized(element);
        expect(spy.calledOnce).to.be.true;
      });

      describe('multiple children', () => {
        let sibling, spy1, spy2;

        beforeEach(() => {
          sibling = element.cloneNode(true);
          parent.appendChild(sibling);

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
        await onceResized(element);
      });

      it('should notify shadow host resize', async () => {
        const spy = sinon.spy(element, '_onResize');
        parent.style.width = '100px';
        await onceResized(element);
        expect(spy.calledOnce).to.be.true;
      });
    });
  });
});
