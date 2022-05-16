import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ResizeMixin } from '../src/resize-mixin.js';

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

        _onResize() {
          this.__resolveResize?.();
        }

        nextResize() {
          return new Promise((resolve) => {
            this.__resolveResize = resolve;
          });
        }
      },
    );
  });

  beforeEach(async () => {
    element = fixtureSync(`<resize-mixin-element></resize-mixin-element>`);
    // Wait for the initial resize.
    await element.nextResize();
  });

  it('should notify resize', async () => {
    element.style.width = '100px';
    await element.nextResize();
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
        await element.nextResize();
      });

      it('should notify parent element resize', async () => {
        parent.style.width = '100px';
        await element.nextResize();
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
        await element.nextResize();
      });

      it('should notify shadow host resize', async () => {
        parent.style.width = '100px';
        await element.nextResize();
      });
    });
  });
});
